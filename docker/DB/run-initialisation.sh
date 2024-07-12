#!/usr/bin/bash
echo "Init DB..."
#/sbin/ifconfig -a
echo "Sleeping for 20s"
sleep 20
echo "slept for 20s"

echo "Adding sqlcmd to path"
PATH=$PATH:/opt/mssql-tools/bin/

echo "Creating & Initailising DB EZPZOS"
sqlcmd -U sa -P EZPZOSAdmin! -d master -i ./SQL_SERVER_CREATE.sql

echo "Initialising Data"
sqlcmd -U sa -P EZPZOSAdmin! -d master -i './Testing Data.sql'

echo "Initialisation Complete"

exit