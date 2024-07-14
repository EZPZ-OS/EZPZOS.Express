while getopts e:t: flag
do
    case "${flag}" in
        e) envname=${OPTARG};;
    esac
done

echo "Building docker-compose"
docker-compose -f "./Mac/docker-compose.yml" -f "./Mac/docker-compose.${envname}.yml"  build

echo "Bring up ${envname}"
docker-compose -f "./Mac/docker-compose.yml" -f "./Mac/docker-compose.${envname}.yml"  up -d