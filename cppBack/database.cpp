#include "database.hpp"
#include "globals.hpp"
#include <iostream>
using namespace std;

// !    you can use our database i uploaded it in github just import it in mysql 
void connectToDatabase(){
     conn = mysql_init(0);
    const char* ca_path = "ca.pem"; 
    mysql_options(conn, MYSQL_OPT_SSL_CA, ca_path);  // ! it is important if you have SSL enabled in your database, if you don't have it you can comment this line 
    if(conn ==nullptr){
        cout<<"MySQL Initialization Failed"<<endl;
        exit(1);
    }

        /*
        ! getenv is used to get the value of an environment variable , for production ⬇️⬇️
        */

    // const char* hostsname=getenv("DB_HOST") ? getenv("DB_HOST") : "";
    // const char* user=getenv("DB_USER") ? getenv("DB_USER") : "";
    // const char* pass=std::getenv("DB_PASS") ? std::getenv("DB_PASS") : "";
    // const char* dbname="bank-system";
    // unsigned int port=;

    /*
    !   and here the database in depelopment mode ⬇️⬇️
    */

    const char* hostsname="";
    const char* user="";
    const char* pass="";
    const char* dbname="";
    unsigned int port=;




    if(mysql_real_connect(conn,hostsname,user,pass,dbname,port,NULL,0)){
        cout<<"Connected to database successfully"<<endl;
    }
    else{
        cout<<"Connection to database failed"<<endl;
        cout << "Error Details: " << mysql_error(conn) << endl;
        exit(1);
    }
}