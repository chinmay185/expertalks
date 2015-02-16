baseDir=/home/chinmay/Work/mongolearning/data

dbpath1=$baseDir/replset1/node1
dbpath2=$baseDir/replset1/node2
dbpath3=$baseDir/replset1/node3

logpath1=$baseDir/replset1/node1.log
logpath2=$baseDir/replset1/node2.log
logpath3=$baseDir/replset1/node3.log

port1=10000
port2=10001
port3=10002

replicaSetName=firstReplSet

mongod --nojournal --dbpath $dbpath1 --port $port1 --logpath $logpath1 --replSet $replicaSetName &
mongod --nojournal --dbpath $dbpath2 --port $port2 --logpath $logpath2 --replSet $replicaSetName &
mongod --nojournal --dbpath $dbpath3 --port $port3 --logpath $logpath3 --replSet $replicaSetName &


# now, to connect to any one of the mongod's use
node1="localhost:$port1"
node2="localhost:$port2"
node3="localhost:$port3"

mongo $node1
mongo $node2
mongo $node3

# shutdown all the processes
# mongod --dbpath $dbpath1 --shutdown
# mongod --dbpath $dbpath2 --shutdown
# mongod --dbpath $dbpath3 --shutdown