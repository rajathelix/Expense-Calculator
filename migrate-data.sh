#!/bin/bash
# File: migrate_data.sh
# Author: Shahidh K Muhammed <shahidh@hasura.io>
# Date: 10.08.2017
# Last Modified: 10.08.2017
# usage: ./migrate-data.sh source_project_name source_postgres_password target_postgres_password
# dependencies: ssh, pg_dump 9.6, psql 9.6, curl, jq

set -e

SOURCE_PROJECT_NAME="$1"
SOURCE_PGHOST="localhost"
SOURCE_PGPORT="7001"
SOURCE_PGUSER="admin"
SOURCE_PGPASSWORD="$2"

SOURCE_HDBHOST="localhost"
SOURCE_HDBPORT="8001"

TARGET_PGHOST="localhost"
TARGET_PGPORT="7002"
TARGET_PGUSER="admin"
TARGET_PGPASSWORD="$3"

TARGET_HDBHOST="localhost"
TARGET_HDBPORT="8002"

DATABASE="hasuradb"

export PGPASSWORD=$SOURCE_PGPASSWORD

echo "=============================================="
echo "starting data migration...."
echo

AUTH_TABLES=("hasura_auth_role" "hasura_auth_user" "hasura_auth_user_roles" "account_emailtokens" "account_smstokens")

for table in ${AUTH_TABLES[@]}; do
  echo "source: dumping ${table} table..."
  pg_dump -h $SOURCE_PGHOST \
    -p $SOURCE_PGPORT \
    -U $SOURCE_PGUSER \
    -d $DATABASE \
    --data-only \
    -n hauthy -t hauthy.${table} > ${SOURCE_PROJECT_NAME}_${table}.sql
  echo "done"
  echo
done

# process hasura_auth_role
AUTH_ROLE_FILE=${SOURCE_PROJECT_NAME}_hasura_auth_role.sql
echo "deleting admin user and anonymous roles..."
sed -i '/1\tadmin/d' $AUTH_ROLE_FILE
sed -i '/2\tuser/d' $AUTH_ROLE_FILE
sed -i '/3\tanonymous/d' $AUTH_ROLE_FILE
echo "done."
echo

# process hasura_auth_user
AUTH_USER_FILE=${SOURCE_PROJECT_NAME}_hasura_auth_user.sql
echo "deleting admin user..."
sed -i '/1\tpbkdf2_sha256\$30000\$.*/d' $AUTH_USER_FILE
echo "done"
echo

# process hasura_auth_user_roles
AUTH_USER_ROLES_FILE=${SOURCE_PROJECT_NAME}_hasura_auth_user_roles.sql
echo "deleting admin user role associations..."
sed -i '/1\t1\t1/d' $AUTH_USER_ROLES_FILE
sed -i '/2\t1\t2/d' $AUTH_USER_ROLES_FILE
echo "done"
echo

echo "source: dumping everything else... this might take a while..."
DATA_FILE=${SOURCE_PROJECT_NAME}_data.sql
pg_dump -h $SOURCE_PGHOST -p $SOURCE_PGPORT -U $SOURCE_PGUSER -d $DATABASE -n public > $DATA_FILE
echo "done"
echo

# export hasuradb metadata
echo "source: fetching hasuradb metadata..."
HDB_METADATA_FILE=${SOURCE_PROJECT_NAME}_hasuradb_metadata.json
FETCH_HDB_QUERY='{"type" : "export_metadata", "args" : {}}'
echo $FETCH_HDB_QUERY | curl http://$SOURCE_HDBHOST:$SOURCE_HDBPORT/v1/query -H 'Content-Type: application/json' -H 'X-Hasura-User-Id: 1' -H 'X-Hasura-Role: admin' -d@- > $HDB_METADATA_FILE
echo "done"
echo

export PGPASSWORD=$TARGET_PGPASSWORD

for table in ${AUTH_TABLES[@]}; do
  echo "target: restoring ${table} table..."
  psql -h $TARGET_PGHOST \
    -p $TARGET_PGPORT \
    -U $TARGET_PGUSER \
    -d $DATABASE --single-transaction < ${SOURCE_PROJECT_NAME}_${table}.sql
  echo "done"
  echo
done

echo "target: restoring everything else..."
psql -h $TARGET_PGHOST \
  -p $TARGET_PGPORT \
  -U $TARGET_PGUSER \
  -d $DATABASE --single-transaction < ${SOURCE_PROJECT_NAME}_data.sql
echo "done"
echo

# replace hasuradb metadata
echo "target: replacing hasuradb metadata..."
REPLACE_HDB_QUERY=$(echo '{"type" : "replace_metadata", "args" : ""}' | jq -c -r ".args = $(cat $HDB_METADATA_FILE)")
echo $REPLACE_HDB_QUERY | curl http://$TARGET_HDBHOST:$TARGET_HDBPORT/v1/query -H 'Content-Type: application/json' -H 'X-Hasura-User-Id: 1' -H 'X-Hasura-Role: admin' -d@-
echo "done"
echo

echo "migration completed successfully...."
echo "=============================================="
echo
