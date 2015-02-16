// connect to any replica set (for ex, mongo localhost:10000) and run the following commands on mongo shell

rs.initiate();

rs.conf(); // to see current configuration

rs.add('chinmay:10001');
rs.add('chinmay:10002');

rs.conf(); // see configuration again

rs.status(); // to check replica set status