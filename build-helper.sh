#!/usr/bin/env bash

set -o errexit; set -o nounset; set -o pipefail

pushd `dirname $0` > /dev/null
SCRIPT_PATH=`pwd`
popd > /dev/null

function print_help()
{
   echo ""
   echo "Usage: $0 -c install"
   echo -e "\t-c Selected Command"
   exit 1 # Exit script after printing help
}

function install_dependencies() {
    for i in  ./*/package.json;
    do
      SERVICE_DIRECTORY="$(dirname "${i}")"
      printf "Start Installing dependencies on %s\n" "$SERVICE_DIRECTORY" ;
      (cd $SERVICE_DIRECTORY && npm i);
    done
}

function run_linter() {
    for i in  ./*/package.json;
    do
      SERVICE_DIRECTORY="$(dirname "${i}")"
      printf "Linting Files on %s\n" "$SERVICE_DIRECTORY" ;
      (cd $SERVICE_DIRECTORY && npm run lint:fix);
    done
}

function clean_node() {
    for i in  ./*/package.json;
    do
      SERVICE_DIRECTORY="$(dirname "${i}")"
      printf "Removing %s\n" "$SERVICE_DIRECTORY/node_modules" ;
      (cd $SERVICE_DIRECTORY && rm -rf node_modules);
    done
}

selected_command=""
while getopts "a:b:c:" opt
do
   case "$opt" in
      a ) selected_command="$OPTARG" ;;
      b ) selected_command="$OPTARG" ;;
      c ) selected_command="$OPTARG" ;;
      ? ) print_help ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ -z "$selected_command" ]
then
   echo "Some or all of the parameters are empty";
   print_help
fi

if [ "${selected_command}" == "install" ]; then
    install_dependencies
fi

if [ "${selected_command}" == "lint" ]; then
    run_linter
fi

if [ "${selected_command}" == "clean" ]; then
    clean_node
fi

# Begin script in case all parameters are correct
echo "$selected_command"
