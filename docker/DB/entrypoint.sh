#!/usr/bin/bash
echo "DB Entrypoint"
# Run Microsoft SQl Server and initialization script (at the same time)
bash /usr/src/app/run-initialisation.sh & /opt/mssql/bin/sqlservr
exit