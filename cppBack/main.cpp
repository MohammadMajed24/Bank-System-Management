


/* 
    !  hey developers, this is manadory to read this before start coding
    !  admin you should put 123456789123 manuly in nationalID column in database to be able to login as admin (I know this is not good but it is just for testing purposes)
    ! 1- we are using crow web framework to create our API, you can find the documentation here: https://crowcpp.org/master/
    !    you can find all libraries in libs folder 

    ! 2- you should change you GCC compiler to MYSYS2 G++ you can find it C:\\msys64\\ucrt64\\bin\\g++.exe after install MYSYS2 and g++ search to make it 

    ! 3- very important important folder .vscode this folder who connects all this file together and conect your code with libraries 

    ! 4- you will be face alot and alot of probelm when you start coding but don't worry about it just try to solve 

    ! 5- to compile the code press crl+shift+b  never ever use run code you should compile it 
            ! then cd cppback and then .\main.exe to run the server
    
    ! 6- this code took a lot of time I hope I helped you in your next projects and if you have
            !  any question don't hesitate to ask me  this my website https://mohamadmajed.ct.ws refresh the website may take 10 seconds to wake up the server
    
    ! 7- thank for who work with me in this project and I hope we will work together in the future
    ! My name is Mohamad Majed 
    ! my team Yossef elzoghby , ahmed mahmoud , mahmoud  abdelsalam 
*/
















/*

 !   hey developers, if command below run it in cmd it will open chrome in without CORS policy,this is manadory
 !      if you run your app on prodution (real web).


  !           start chrome --disable-web-security --user-data-dir="C:\TempChrome"
*/



#include <iostream>
#include "crow.h"
#include <string>
#include <mysql.h>
#include "globals.hpp"
#include "routes.hpp"
#include <time.h> //time library
#include <iomanip> //for put_time
#include <sstream>// to convert time to string


#include "Classes/SDLL.hpp"
#include "Classes/TransactionDLL.hpp"
#include "Classes/StackPassword.hpp"
#include "Classes/QActivateAccounts.hpp"
#include "Classes/Branch.hpp" 
#include "Classes/FixedSSl.hpp"
#include "Classes/FQue.hpp"

#include "database.hpp"
#include "readData.hpp"
using namespace std;

SLL userList; 
TransactionDLL transactionList;
QActivateAccounts activateAccounts;
MYSQL* conn;
StackPassword stackPassword;

LoanSLL LoanSSL;
LoanQueue LoanQ;
notfsll NotfiSLL;


FixedSLL FixedSSL;
FixedQueue FixedQ;


BranchList branchList;

int main()
{
    /*
    
    ! how this application works:
    ! 1- connect to database
    ! 2- read all data from database and store it in data structures (linked lists, queues, stacks, etc...)
    ! 3- setup routes for the application (API endpoints)
    ! 4- run the application on port 10000
    
    */
    connectToDatabase();


    readAllDataFromDatabase();
    readAllLoansFromDatabase();
    readAllNotificationsFromDatabase();
    readAllFixedFromDatabase();
    readAllBranchesForUser();


    crow::SimpleApp app; 
    setupRoutes(app); 
    setupLoanRoutes(app);
    setupBranchRoutes(app);
    setupFixedRoutes(app);
    checktimeroute(app);
    setupNotfiRoutes(app);




    cout << "We are on port 10000..." << endl;
    
    app.bindaddr("0.0.0.0").port(10000).multithreaded().run();
    mysql_close(conn);
    return 0;
}





