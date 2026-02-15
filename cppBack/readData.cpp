#include "readData.hpp"
#include "globals.hpp"
#include <mysql.h>
#include <string>
using namespace std;


void readAllDataFromDatabase(){
    MYSQL_ROW row;
    MYSQL_RES* res;
    long long int balance=0;
    int qstate=mysql_query(conn,"SELECT fname, lname, nationalID, birthdate, email, phone, password, address, job, accountType, createAt,balance,accountNumber,status FROM users");
    if(!qstate){// all team member qstate will return 0 if the query is successful
        res=mysql_store_result(conn);
        while((row=mysql_fetch_row(res))){
             balance=row[11]?stoll(row[11]):0;
            userList.insertAtB(
                row[0],
                row[1],
                row[2],
                row[3],
                row[4],
                row[5],
                row[6],
                row[7],
                row[8],
                row[9],
                row[10],
                balance,
                row[12],
                row[13]
            );
        }
        
        mysql_free_result(res);
    }
    else{
        cout<<"Query userlist Execution Problem!"<<endl;
    }
    int qstate2=mysql_query(conn,"SELECT fname, lname, email, createAt FROM users WHERE status = 'hold'");
    if(!qstate2){// all team member qstate will return 0 if the query is successful
        res=mysql_store_result(conn);
        string name1;
        string name2;
        while((row=mysql_fetch_row(res)))
        {
            name1=row[0];
            name2=row[1];
            activateAccounts.addAccount(name1+ " " + name2,row[2],row[3]);
        }
        mysql_free_result(res);
    }
    else{
        cout<<"Query activateAccounts  Execution Problem!2"<< mysql_error(conn) << endl;
    }
    qstate=mysql_query(conn,"SELECT id, senderAccount, receiverAccount, amount, date FROM transactions");
    long long int totalBalance=0;
    if(!qstate){
        res=mysql_store_result(conn);
        while((row=mysql_fetch_row(res))){
            transactionList.insertTransaction(
                stoll(row[0]),
                row[1],
                row[2],
                stoll(row[3]),
                row[4]
            );
            totalBalance+=stoll(row[3]);
        }
        userList.setTotalBalance(totalBalance);
        mysql_free_result(res);
    }
    else{
        cout<<"Query transactionList Execution Problem!"<<endl;
    }


    qstate=mysql_query(conn,"SELECT  email,`new-password` FROM `password-requests` WHERE status = 'pending' ORDER BY id DESC");
    if(!qstate){
        res=mysql_store_result(conn);
        while((row=mysql_fetch_row(res))){
            stackPassword.pushRequest(row[1],row[0]);
        }
        mysql_free_result(res);
        cout<<"Password change requests loaded successfully!"<<endl;
    }
    else{
        cout<<"Query stackPassword Execution Problem!"<<mysql_error(conn)<<endl;
    }


}

void readAllLoansFromDatabase() {
    MYSQL_ROW row;
    MYSQL_RES* res;
    

    int qstate = mysql_query(conn, "SELECT id, email, states, duration, loan_cost, date FROM loans");
    
    if (!qstate) { // 0 means query successful
        res = mysql_store_result(conn);
        while ((row = mysql_fetch_row(res))) {
            int id = stoi(row[0]);            
            string email = row[1];            
            int states = stoi(row[2]);       
            string duration = row[3];         
            string loan_cost = row[4];        
            string date = row[5];             
            

            LoanSSL.insertAtL(id, email, states, duration, loan_cost, date);
            if(states == 2){
                LoanQ.insert(id, email, states, duration, loan_cost, date);
            }
        }
        mysql_free_result(res);
        cout << "Loans loaded successfully!" << endl;
    }
    else {
        cout << "Loan Execution Problem! " << mysql_error(conn) << endl;
    }
}



void readAllFixedFromDatabase() {
    MYSQL_ROW row;
    MYSQL_RES* res;

    int qstate = mysql_query(conn, "SELECT id, email, status, duration, amount, profit , fixed_date , number_of_profit FROM Fixed");
    
    if (!qstate) { // 0 means query successful
        res = mysql_store_result(conn);
        while ((row = mysql_fetch_row(res))) {
            int id = stoi(row[0]);            
            string email = row[1];            
            int status = stoi(row[2]);           
            string duration = row[3];         
            long long int amount = stoll(row[4]);        
            long long int profit = stoll(row[5]);  
            string date = row[6];
            int nu_of_profits = stoi(row[7]);

            FixedSSL.insertAtL(id, email, duration, amount, profit, date, status, nu_of_profits);
            if(status == 2){
            FixedQ.insert(id, email, duration, amount, profit, date, status);
            }
            
        }
        mysql_free_result(res);
        cout << "Fixed deposits loaded successfully!" << endl;
    }
    else {
        cout << "Fixed Execution Problem! " << mysql_error(conn) << endl;
    }
}






// void readAllBranchesFromDatabase() {
//     MYSQL_ROW row;
//     MYSQL_RES* res;

//     int qstate = mysql_query(conn, "SELECT id, branch_name, location_link, phone, address FROM branches");
//     if (!qstate) {
//         res = mysql_store_result(conn);
//         while ((row = mysql_fetch_row(res))) {
//             int id = row[0] ? stoi(row[0]) : 0;
//             string name = row[1] ? row[1] : "";
//             string loc = row[2] ? row[2] : "";
//             string phone = row[3] ? row[3] : "";
//             string addr = row[4] ? row[4] : "";
//             branchList.insert(id, name, loc, phone, addr);
//         }
//         mysql_free_result(res);
//         cout << "Branches loaded successfully!" << endl;


       
//     } else {
//         cout << "Query Execution Problem! " << mysql_error(conn) << endl;
//     }
// }





void readAllBranchesForUser()
{
    MYSQL_ROW row;
    MYSQL_RES* res;

    int qstate = mysql_query(conn,
        "SELECT id, branch_name, location_link, phone, address, created_at "
        "FROM branches");

    if (!qstate)
    {
        res = mysql_store_result(conn);

        while ((row = mysql_fetch_row(res)))
        {
            branchList.insert(
                stoi(row[0]),   // id
                row[1],         // branch_name
                row[2],         // location_link
                row[3],         // phone
                row[4]         // address
            );
        }
        mysql_free_result(res);
        cout<<"Branches user loaded successfully!"<<endl;
    }
    else
    {
        cout << "Read branches error: " << mysql_error(conn) << endl;
    }
}


void readAllNotificationsFromDatabase() {
    MYSQL_ROW row;
    MYSQL_RES* res;

    int qstate = mysql_query(conn, "SELECT id, user, message, status, createdAt FROM notifications");
    
    if (!qstate) { // 0 means query successful
        res = mysql_store_result(conn);
        while ((row = mysql_fetch_row(res))) {
            int id = stoi(row[0]);            
            string email = row[1];            
            string message = row[2];         
            int states = stoi(row[3]);        
            string date = row[4];

            NotfiSLL.insertAtB(id, email, message, states, date);
        }
        mysql_free_result(res);
        cout << "Notifications loaded successfully!" << endl;
    }
    else {
        cout << "Notifications Execution Problem! " << mysql_error(conn) << endl;
    }
}