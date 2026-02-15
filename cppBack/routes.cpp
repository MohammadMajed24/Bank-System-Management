#include "routes.hpp"
#include "globals.hpp"
#include <string>
#include <mysql.h>
#include "database.hpp"
#include <iostream>
#include "Classes/SDLL.hpp"
#include "Classes/Branch.hpp"
#include "Classes/FixedSSl.hpp"
#include "Classes/FQue.hpp"
using namespace std;
using namespace crow;

void setupRoutes(crow::SimpleApp &app)
{
    //! MOOOOOHHHHAAAAMMMMAAAADDDDD
    CROW_ROUTE(app, "/")([]()
                         { return "Server is Online!"; });
    CROW_ROUTE(app, "/signup")([]()
                               { return "Signup route"; });

    CROW_ROUTE(app, "/api/signup")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
                                                      if (req.method == "OPTIONS"_method)
                                                          return crow::response(200);

                                                      json::rvalue data = json::load(req.body);
                                                      if (!data)
                                                          return crow::response(400, "Invalid JSON");
                                                      string fName = data.has("firstName") ? data["firstName"].s() : (string) "Unknown";
                                                      string lName = data.has("lastName") ? data["lastName"].s() : (string) "";
                                                      string natID = data.has("nationalID") ? data["nationalID"].s() : (string) "";
                                                      string bDate = data.has("birthdate") ? data["birthdate"].s() : (string) "";
                                                      string email = data.has("email") ? data["email"].s() : (string) "";
                                                      string phone = data.has("phone") ? data["phone"].s() : (string) "";
                                                      string pass = data.has("password") ? data["password"].s() : (string) "";
                                                      string addr = data.has("address") ? data["address"].s() : (string) "";
                                                      string job = data.has("job") ? data["job"].s() : (string) "";
                                                      string accType = data.has("accountType") ? data["accountType"].s() : (string) "";
                                                      string createAt=currentDate();
                                                      int balance=0;
                                                      string accountNumber=userList.createAccountNumber(accType);
                                                      string query = "INSERT INTO users (fname, lname, nationalID, birthdate, email, phone, password, address, job, accountType, createAt,accountNumber) VALUES ('" + fName + "', '" + lName + "', '" + natID + "', '" + bDate + "', '" + email + "', '" + phone + "', '" + pass + "', '" + addr + "', '" + job + "', '" + accType + "', '" + createAt + "', '" + accountNumber + "')";
                                                      if (mysql_query(conn, query.c_str()) == 0)
                                                      {
                                                          string token = userList.insertAtB(
                                                              data.has("firstName") ? (string)data["firstName"].s() : string("Unknown"),
                                                              data.has("lastName") ? (string)data["lastName"].s() : string(""),
                                                              data.has("nationalID") ? (string)data["nationalID"].s() : string(""),
                                                              data.has("birthdate") ? (string)data["birthdate"].s() : string(""),
                                                              data.has("email") ? (string)data["email"].s() : string(""),
                                                              data.has("phone") ? (string)data["phone"].s() : string(""),
                                                              data.has("password") ? (string)data["password"].s() : string(""),
                                                              data.has("address") ? (string)data["address"].s() : string(""),
                                                              data.has("job") ? (string)data["job"].s() : string(""),
                                                              data.has("accountType") ? (string)data["accountType"].s() : string(""),
                                                              createAt,
                                                              balance,
                                                              accountNumber,
                                                              "hold"
                                                            );
                                                            string tokenQuery="UPDATE users SET token = '" + token + "' WHERE email = '" + email + "'";
                                                            if(mysql_query(conn,tokenQuery.c_str())==0){
                                                                activateAccounts.addAccount(fName+" "+lName, email, createAt);
                                                           
                                                            crow::json::wvalue response;
                                                          response["status"] = "success";
                                                          response["message"] = "User added!";
                                                          return crow::response(200, response);
                                                        }
                                                        else{
                                                            string errorMsg = mysql_error(conn);
                                                            cout << "MySQL Query Error: " << errorMsg << endl;
                                                            crow::json::wvalue response;
                                                            response["status"] = "error";
                                                            response["message"] = "User not added!" + errorMsg;
                                                            return crow::response(400, response);
                                                        }

                                                      }
                                                      else
                                                      {
                                                          string errorMsg = mysql_error(conn);
                                                          cout << "MySQL Query Error: " << errorMsg << endl;
                                                          crow::json::wvalue response;
                                                          response["status"] = "error";
                                                          response["message"] = "User not added!" + errorMsg;
                                                          return crow::response(400, response);} });

    CROW_ROUTE(app, "/api/login")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);
       
        json::rvalue data =json::load(req.body);
        if(!data)return response(400,"Invalid JSON");

        string* userData=userList.validateLogin(
            data.has("email")?(string)data["email"].s():(string)"",
            data.has("password")?(string)data["password"].s():(string)""
        );

        if(userData !=nullptr){
                    string tokenQuery="UPDATE users SET token = '" + userData[10] + "' WHERE email = '" + (data.has("email")?(string)data["email"].s():(string)"")+"'";
                    if(mysql_query(conn,tokenQuery.c_str())==0){

                        json::wvalue response;
                        response["status"]="success";
                        response["message"]="Login successful";
                        response["user"]={
                            {"firstName",userData[0]},
                            {"lastName",userData[1]},
                            {"nationalID",userData[2]},
                            {"birthdate",userData[3]},
                            {"email",userData[4]},
                            {"phone",userData[5]},
                            {"password",userData[6]},
                            {"address",userData[7]},
                            {"job",userData[8]},
                            {"accountType",userData[9]},
                            {"accountNumber",userData[14]},
                            {"createAt",userData[15]},
                            {"status",userData[16]}
                        };
                        response["token"] = userData[10];
                        delete[] userData;
                        return crow::response(200,response);
                         }
                        else{
                            string errorMsg = mysql_error(conn);
                            cout << "MySQL Query Error: " << errorMsg << endl;
                            crow::json::wvalue response;
                            response["status"] = "error";
                            response["message"] = "somthing went wrong" + errorMsg;
                            delete[] userData;
                            return crow::response(400, response);
                        }
        }
        else{
            json::wvalue response;
            response["status"]="error";
            response["message"]="Invalid email or password";
            return crow::response(401,response);
        } });

    CROW_ROUTE(app, "/api/get-users")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
                                                      if (req.method == "OPTIONS"_method)
                                                          return crow::response(200);

                                                      json::rvalue data = json::load(req.body);
                                                      if (!data)
                                                          return crow::response(400, "Invalid JSON");

                                                      string email = data.has("email") ? (string)data["email"].s() : (string) "";
                                                      if(userList.checkIfAdmin(email)==false){
                                                          json::wvalue response;
                                                          response["status"]="error";
                                                          response["message"]="Unauthorized";
                                                          return crow::response(401,response);
                                                      }
                                                      crow::json::wvalue response;
                                                      response["users"] = userList.getAllData();
                                                      return crow::response(200, response); });

    CROW_ROUTE(app, "/api/holded-accounts")
        .methods("GET"_method, "OPTIONS"_method)([](const request &req)
                                                 {
                                                     if (req.method == "OPTIONS"_method)
                                                         return crow::response(200);
                                                     json::wvalue response;
                                                     response["accounts"] = activateAccounts.getAccountsJSON();
                                                     return crow::response(200, response); });

    CROW_ROUTE(app, "/api/holded-accounts/activate")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);
        string email = activateAccounts.getFront();
        activateAccounts.removeAccount();
        userList.getNodeByEmail(email)->status = "active";
        string query = "UPDATE users SET status = 'active' WHERE email = '" + email + "'";
        if(mysql_query(conn, query.c_str()) != 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
        json::wvalue response;
        response["status"] = "success";
        return crow::response(200, response); });

    CROW_ROUTE(app, "/api/holded-accounts/delete")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);
        string email = activateAccounts.getFront();
        string query = "DELETE FROM users WHERE email = '" + email + "'";
        if(mysql_query(conn, query.c_str()) != 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
        activateAccounts.removeAccount();
        userList.deleteNodeByEmail(email);
        json::wvalue response;
        response["status"] = "success";
        return crow::response(200, response); });

    CROW_ROUTE(app, "/api/get-user-data")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
                                                      if (req.method == "OPTIONS"_method)
                                                          return crow::response(200);

                                                      json::rvalue data = json::load(req.body);
                                                      if (!data)
                                                          return response(400, "Invalid JSON");

                                                      string email = data.has("email") ? (string)data["email"].s() : (string) "";

                                                      json::wvalue response;
                                                      response["user"] = userList.getDataByEmail(email);
                                                      return crow::response(200, response); });

    CROW_ROUTE(app, "/api/send-money")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);
        json::rvalue data=json::load(req.body);
        
        if(!data)return response(400,"Invalid JSON");
        string senderAccountNumber=data.has("senderAccountNumber")?(string)data["senderAccountNumber"].s():(string)"";
        long long int amount=data.has("amount")?stoll((string)data["amount"].s()):0;
        string receiverAccountNumber=data.has("receiverAccountNumber")?(string)data["receiverAccountNumber"].s():(string)"";
        if(userList.isActive(senderAccountNumber)==false){
            json::wvalue response;
            response["status"] = "error";
            response["message"] = "sender account is not active";
            return crow::response(400, response);
        }
        if(userList.isActive(receiverAccountNumber)==false){
            json::wvalue response;
            response["status"] = "error";
            response["message"] = "receiver account is not active";
            return crow::response(400, response);
        }
        bool status=userList.sendMoney(senderAccountNumber, receiverAccountNumber, amount);
        if(status==false){
            json::wvalue response;
            response["status"] = "error";
            response["message"] = "Transaction failed";
            return crow::response(400, response);
        }
        string query = "UPDATE users SET balance = balance - " + to_string(amount) + " WHERE accountNumber = '" + senderAccountNumber + "'";
        if(mysql_query(conn, query.c_str()) != 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
            string message1 = "Dear customer, your account has received a transfer of " 
                            + to_string(amount) + 
                            " from user account " + senderAccountNumber + 
                            ". The amount has been successfully credited to your balance.";
            
            string message2 = "Dear customer, you have successfully sent an amount of " 
                            + to_string(amount) + 
                            " to account number " + receiverAccountNumber + 
                            ". The transfer has been completed successfully.";
            string email_sender =userList.getEmailbyAccountNumber(senderAccountNumber);
            string email_receiver =userList.getEmailbyAccountNumber(receiverAccountNumber);

            string query4 = "INSERT INTO notifications (user, message, status, createdAt) VALUES ('" + email_sender + "', '" + message2 + "', 0, '" + currentDate() + "')";

            string query3 = "INSERT INTO notifications (user, message, status, createdAt) VALUES ('" + email_receiver + "', '" + message1 + "', 0, '" + currentDate() + "')";

                if(mysql_query(conn, query4.c_str()) == 0){

        NotfiSLL.insertAtB(mysql_insert_id(conn), email_sender, message2, 0, currentDate());
    } else {
        cout << "❌ Send Money (sender) Notification insertion failed: " << mysql_error(conn) << endl;
    }
    if(mysql_query(conn, query3.c_str()) == 0){
        NotfiSLL.insertAtB(mysql_insert_id(conn), email_receiver, message1, 0, currentDate());
    } else {
        cout << "❌ Send Money (receiver) Notification insertion failed: " << mysql_error(conn) << endl;
    }


        query = "UPDATE users SET balance = balance + " + to_string(amount) + " WHERE accountNumber = '" + receiverAccountNumber + "'";
        if(mysql_query(conn, query.c_str()) != 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
        query = "INSERT INTO transactions (senderAccount, receiverAccount, amount, date) VALUES ('" + senderAccountNumber + "', '" + receiverAccountNumber + "', " + to_string(amount) + ", '" + currentDate() + "')";
        if(mysql_query(conn, query.c_str()) != 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
        query = "SELECT id FROM transactions WHERE senderAccount = '" + senderAccountNumber + "' AND receiverAccount = '" + receiverAccountNumber + "' AND amount = " + to_string(amount) + " ORDER BY id DESC LIMIT 1";
        if(!mysql_query(conn, query.c_str()))
        {
            MYSQL_RES* res = mysql_store_result(conn);
            MYSQL_ROW row = mysql_fetch_row(res);
            int transactionId = stoi(row[0]);
            transactionList.insertTransaction(transactionId, senderAccountNumber, receiverAccountNumber, amount, currentDate());
            mysql_free_result(res);
        }
        json::wvalue response;
        response["status"] = "success";
        return crow::response(200, response); });

    CROW_ROUTE(app, "/api/user-transaction")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);

        json::rvalue data=json::load(req.body);
        if(!data)return response(400,"Invalid JSON");

        string accountNumber=data.has("accountNumber")?(string)data["accountNumber"].s():(string)"";
        json::wvalue response;
        response["transactions"]=transactionList.getUserTransactions(accountNumber);
        return crow::response(200,response); });

    CROW_ROUTE(app, "/api/all-transactions")
        .methods("GET"_method, "OPTIONS"_method)([](const request &req)
                                                 {
        if (req.method == "OPTIONS"_method) return crow::response(200);

        json::wvalue response;
        response["transactions"]=transactionList.getAllTransactions();
        return crow::response(200,response); });

    CROW_ROUTE(app, "/api/search-transaction")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);

        json::rvalue data=json::load(req.body);
        if(!data)return response(400,"Invalid JSON");

        int searchId=data.has("searchId")?(int)data["searchId"].i():0;
        json::wvalue response;
        response["transactions"]=transactionList.getTransactionById(searchId);
        return crow::response(200,response); });

    CROW_ROUTE(app, "/api/change-password")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);

        json::rvalue data=json::load(req.body);
        if(!data)return response(400,"Invalid JSON");

        string email=data.has("email")?(string)data["email"].s():(string)"";
        string oldPassword=data.has("oldPassword")?(string)data["oldPassword"].s():(string)"";
        string newPassword=data.has("newPassword")?(string)data["newPassword"].s():(string)"";
        bool checkOldPassword = userList.checkPassword(email, oldPassword);
        if(checkOldPassword==false){
            json::wvalue response;
            response["status"] = "error";
            response["message"] = "Old password is incorrect";
            return crow::response(400, response);
        }
        string query="INSERT INTO `password-requests` (`email`, `new-password`) VALUES('"+email+"','"+newPassword+"')";
        if(mysql_query(conn,query.c_str())==0){
                bool found = userList.checkIfUserExist(email);

            if (!found ) {
                json::wvalue response;
                response["status"] = "error";
                response["message"] = "User not found";
                return crow::response(404, response);
            }
            stackPassword.pushRequest(newPassword, email);

    }
        else{
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
        
        json::wvalue response;
        response["status"] = "success";
        return crow::response(200, response); });

    CROW_ROUTE(app, "/api/password-change-requests")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);
        json::rvalue data=json::load(req.body);
        if(!data)return response(400,"Invalid JSON");
        string email=data.has("email")?(string)data["email"].s():(string)"";
        bool isAdmin = userList.checkIfAdmin(email);
        if(isAdmin==false){
            json::wvalue response;
            response["status"] = "error";
            response["message"] = "Unauthorized";
            return crow::response(401, response);
        }
        json::wvalue response;
        response["requests"] = stackPassword.getAllData();
        return crow::response(200, response); });

    CROW_ROUTE(app, "/api/approve-password-change")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
                                                      if (req.method == "OPTIONS"_method)
                                                          return crow::response(200);
                                                      json::rvalue data = json::load(req.body);
                                                      if (!data)
                                                          return response(400, "Invalid JSON");
                                                      string email = data.has("email") ? (string)data["email"].s() : (string) "";
                                                      string newPassword = data.has("newPassword") ? (string)data["newPassword"].s() : (string) "";
                                                      string userEmail = data.has("userEmail") ? (string)data["userEmail"].s() : (string) "";
                                                      bool isAdmin = userList.checkIfAdmin(email);
                                                      if (isAdmin == false)
                                                      {
                                                          json::wvalue response;
                                                          response["status"] = "error";
                                                          response["message"] = "Unauthorized";
                                                          return crow::response(401, response);
                                                      }
                                                      if (stackPassword.isEmpty())
                                                      {
                                                          json::wvalue response;
                                                          response["status"] = "error";
                                                          response["message"] = "No password change requests";
                                                          return crow::response(400, response);
                                                      }
                                                      string query = "UPDATE users SET password = '" + newPassword + "' WHERE email = '" + userEmail + "'";
                                                      if (mysql_query(conn, query.c_str()) != 0)
                                                      {
                                                          string errorMsg = mysql_error(conn);
                                                          cout << "MySQL Query Error: " << errorMsg << endl;
                                                          crow::json::wvalue response;
                                                          response["status"] = "error";
                                                          response["message"] = "somthing went wrong" + errorMsg;
                                                          return crow::response(400, response);
                                                      }
                                                      query = "UPDATE `password-requests` SET status = 'approved' WHERE email = '" + userEmail + "' AND status = 'pending'";
                                                      if (mysql_query(conn, query.c_str()) != 0)
                                                      {
                                                          string errorMsg = mysql_error(conn);
                                                          cout << "MySQL Query Error: " << errorMsg << endl;
                                                          crow::json::wvalue response;
                                                          response["status"] = "error";
                                                          response["message"] = "somthing went wrong" + errorMsg;
                                                          return crow::response(400, response);
                                                      }
                                                      userList.updatePassword(userEmail, newPassword);
                                                      stackPassword.popRequest();
                                                      json::wvalue response;
                                                      response["status"] = "success";
                                                      return crow::response(200, response); });

    CROW_ROUTE(app, "/api/deny-password-change")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
        if (req.method == "OPTIONS"_method) return crow::response(200);
        json::rvalue data=json::load(req.body);
        if(!data)return response(400,"Invalid JSON");
        string email=data.has("email")?(string)data["email"].s():(string)"";
        string newPassword=data.has("newPassword")?(string)data["newPassword"].s():(string)"";
        string userEmail=data.has("userEmail")?(string)data["userEmail"].s():(string)"";
        bool isAdmin = userList.checkIfAdmin(email);
        if(isAdmin==false){
            json::wvalue response;
            response["status"] = "error";
            response["message"] = "Unauthorized";
            return crow::response(401, response);
        }
        if(stackPassword.isEmpty()){
            json::wvalue response;
            response["status"] = "error";
            response["message"] = "No password change requests";
            return crow::response(400, response);
        }
        string query = "UPDATE `password-requests` SET status = 'denied' WHERE email = '" + userEmail + "' AND status = 'pending' ORDER BY id DESC LIMIT 1";
            if(mysql_query(conn, query.c_str()) != 0)
            {
                string errorMsg = mysql_error(conn);
                cout << "MySQL Query Error: " << errorMsg << endl;
                crow::json::wvalue response;
                response["status"] = "error";
                response["message"] = "somthing went wrong" + errorMsg;
                return crow::response(400, response);
            }
        stackPassword.popRequest();
        json::wvalue response;
        response["status"] = "success";
        return crow::response(200, response); });

    CROW_ROUTE(app, "/api/adman-home-data")
        .methods("POST"_method)([](const request &req)
                                {
                                    json::rvalue data = json::load(req.body);
                                    if (!data)
                                        return response(400, "Invalid JSON");
                                    string email = data.has("email") ? (string)data["email"].s() : (string) "";
                                    bool isAdmin = userList.checkIfAdmin(email);
                                    if (isAdmin == false)
                                    {
                                        json::wvalue response;
                                        response["status"] = "error";
                                        response["message"] = "Unauthorized";
                                        return crow::response(401, response);
                                    }
                                    json::wvalue response;
                                    response["status"] = "success";
                                    response["userCount"] = userList.getUserCount();
                                    response["totalBalance"] = userList.getTotalBalance();
                                    response["totalLoanRequest"] = LoanQ.getTotalLoanRequest();
                                    return crow::response(200, response); });
}

//! yoooooooooooooooosssssssssseeeeeffff

void setupLoanRoutes(crow::SimpleApp &app)
{
    CROW_ROUTE(app, "/api/submit-loan-request")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
                                                    if (req.method == "OPTIONS"_method)
                                                        return crow::response(200);
                                                    json::rvalue data = json::load(req.body);
                                                    if (!data)
                                                        return response(400, "Invalid JSON");
                                                    string email = data.has("email") ? (string)data["email"].s() : (string) "";
                                                    string duration = data.has("duration") ? (string)data["duration"].s() : (string) "";
                                                    long long int money = data.has("moneyOfLoan") ? (int)data["moneyOfLoan"] : 0;
                                                    if (!userList.checkIfUserExist(email))
                                                    {
                                                        cout << 1;
                                                        json::wvalue err;
                                                        err["message"] = "the user not exist";
                                                        return crow::response(400, err);
                                                    }
                                                    string query = "INSERT INTO loans (email,states,duration,loan_cost,date) VALUES('" + email + "',2,'" + duration + "','" + to_string(money) + "','" + currentDate() + "') ";
                                                    if (mysql_query(conn, query.c_str()) == 0)
                                                    {
                                                        long long id = mysql_insert_id(conn);
                                                        LoanQ.insert(id, email, 2, duration, to_string(money), currentDate());
                                                        LoanSSL.insertAtL(id, email, 2, duration, to_string(money), currentDate());
                                                        return crow::response(200, "ok");
                                                    }
                                                    else
                                                    {
                                                        json::wvalue err;
                                                        err["message"] = mysql_error(conn);
                                                        return crow::response(400, err);
                                                    } });

    CROW_ROUTE(app, "/api/pay-loan")
        .methods("POST"_method, "OPTIONS"_method)([](const crow::request &req)
                                                  {
        if (req.method == "OPTIONS"_method)
            return crow::response(200);

        auto data = crow::json::load(req.body);
        if (!data)
            return crow::response(400, "Invalid JSON");

        string email = data.has("email") ? (string)data["email"].s() : "";
        int loanId = data.has("loanId") ? (int)data["loanId"].i() : 0;

        if (!userList.checkIfUserExist(email)) {
            crow::json::wvalue err;
            err["message"] = "User does not exist";
            return crow::response(400, err);
        }


        if (!LoanSSL.checkIfIdExit(loanId)) {
            crow::json::wvalue err;
            err["message"] = "Loan ID not found";
            return crow::response(400, err);
        }
         int state = LoanSSL.getstates(loanId);
        if (state != 1 && state != 4) { // Only approved or late
            crow::json::wvalue err;
            err["message"] = "Loan is not payable";
            return crow::response(400, err);
        }

        long long int amount = LoanSSL.getLoanCostById(loanId);
        if(amount <= 0){
            crow::json::wvalue err;
            err["message"] = "Invalid loan amount";
            return crow::response(400, err);
        }

        if (userList.getUserBalance(email) < amount) {
            crow::json::wvalue err;
            err["message"] = "Insufficient balance to pay the loan";
            return crow::response(400, err);
        }
        string accountNo = userList.getAccountnu(email);
        string query2 = "UPDATE loans SET states = 0 WHERE id = " + to_string(loanId);
        string qeuery = "UPDATE users SET balance = balance - " + to_string(amount) + " WHERE email = '" + email + "'";
        string query3 = "INSERT INTO transactions (senderAccount, receiverAccount, amount, date) VALUES ('" + accountNo + "','BANK',  " + to_string(amount) + ", '" + currentDate() + "')";
        string message = "Dear customer, your payment of " + to_string(amount) + 
                  " for loan ID " + to_string(loanId) + 
                  " has been successfully received. Thank you for your prompt payment.";


        string query7 = "INSERT INTO notifications (user, message, status, createdAt) VALUES ('" + email + "', '" + message + "', 0, '" + currentDate() + "')";
        if(mysql_query(conn, qeuery.c_str()) == 0 && mysql_query(conn, query2.c_str()) == 0 && mysql_query(conn, query3.c_str()) == 0){   
            userList.sendMoney( accountNo, "BANK", amount);  
            transactionList.insertTransaction(mysql_insert_id(conn), accountNo, "BANK", amount, currentDate());  
            LoanSSL.changestates(loanId, 0); // paid
                    if(mysql_query(conn, query7.c_str()) == 0)
                    NotfiSLL.insertAtB(mysql_insert_id(conn), email, message, 0, currentDate());
                    else
                    cout << "❌ Pay loan Notification insertion failed: " << mysql_error(conn) << endl;
        } else {
            crow::json::wvalue err;
            err["message"] = mysql_error(conn);
            return crow::response(400, err);
        }


        return crow::response(200, "Loan paid successfully"); });

    CROW_ROUTE(app, "/api/admin/get-all-loans")
        .methods("GET"_method)([]()
                               { return crow::response(200, LoanQ.getAllLoansJSON()); });

    CROW_ROUTE(app, "/api/admin/approve-loan")
        .methods("POST"_method, "OPTIONS"_method)([](const crow::request &req)
                                                  {
    if (req.method == "OPTIONS"_method) return crow::response(200);

    auto data = crow::json::load(req.body);
    if (!data) return crow::response(400, "Invalid JSON");

    int id = data["id"].i();
    vector<string> data1 = LoanQ.getEmailAndMoney(id);
        if (data1.size() < 2) {
    return crow::response(400, "ID not found in FixedQueue");
    }
    string email = data1[0];
    string money = data1[1];
    json::wvalue account_B =userList.getDataByEmail(email);
    string temp=account_B.dump();
    json::rvalue account = json::load(temp);
    string accountNo = account.has("accountNumber") ? (string)account["accountNumber"].s() : (string)"";

            string query = "INSERT INTO transactions (senderAccount, receiverAccount, amount, date) VALUES ('BANK', '" + accountNo + "', " + money + ", '" + currentDate() + "')";
        if(mysql_query(conn, query.c_str()) != 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
        query = "SELECT id FROM transactions WHERE senderAccount = 'BANK' AND receiverAccount = '" + accountNo + "' AND amount = " + money + " ORDER BY id DESC LIMIT 1";
        if(mysql_query(conn, query.c_str())!= 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
            
        MYSQL_RES* res = mysql_store_result(conn);
        MYSQL_ROW row = mysql_fetch_row(res);
        int transactionId = stoi(row[0]);
        mysql_free_result(res);

    long long int moneyInt = stoll(money);
    query = "UPDATE loans SET states = 1, date = '" + currentDate() +"' WHERE id = " + to_string(id);
    string query2 = "UPDATE users SET balance = balance + " + to_string(moneyInt) +" WHERE email = '" + email + "'";
    
    string query3 = "INSERT INTO transactions (senderAccount, receiverAccount, amount, date) VALUES ('BANK', '" + accountNo + "', " + money + ", '" + currentDate() + "')";
        string message = "Dear customer, we are pleased to inform you that your loan with ID " 
                        + to_string(id) + 
                        " has been successfully approved. The loan amount will be processed according to the agreed terms.";


        string query4 = "INSERT INTO notifications (user, message, status, createdAt) VALUES ('" + email + "', '" + message + "', 0, '" + currentDate() + "')";



    if(mysql_query(conn,query.c_str())==0 && mysql_query(conn,query2.c_str())==0 && mysql_query(conn,query3.c_str())==0){   
    transactionList.insertTransaction(transactionId, "BANK", accountNo, moneyInt, currentDate());  
    userList.sendMoney("BANK", accountNo, moneyInt);  
    LoanQ.changestates(id, 1); // approveds
    LoanSSL.changestates(id, 1); // approveds
    LoanQ.remove();

    if(mysql_query(conn, query4.c_str()) == 0){
        NotfiSLL.insertAtB(mysql_insert_id(conn), email, message, 0, currentDate());
    } else {
        cout << "❌ Loan approval Notification insertion failed: " << mysql_error(conn) << endl;
    }

        return crow::response(200, "State updated");
        }
        else{
                json::wvalue err;
                err["message"]=mysql_error(conn);
                return crow::response(400,err);
            }


    return crow::response(200, "approved"); });

    //////////////////////////////////
    CROW_ROUTE(app, "/api/admin/deny-loan")
        .methods("POST"_method, "OPTIONS"_method)([](const crow::request &req)
                                                  {
    if (req.method == "OPTIONS"_method) return crow::response(200);

    auto data = crow::json::load(req.body);
    if (!data) return crow::response(400, "Invalid JSON");

    int id = data["id"].i();
    string query = "UPDATE loans SET states = 3 WHERE id = " + to_string(id);
    string message = "Dear customer, we regret to inform you that your loan application with ID " 
                 + to_string(id) + 
                 " has not been approved at this time. Please contact customer support for further information.";
    string email = LoanSSL.getEmailById(id);
    if(email.empty()) {
        return crow::response(400, "Loan ID not found");
    }

    string query4 = "INSERT INTO notifications (user, message, status, createdAt) VALUES ('" + email + "', '" + message + "', 0, '" + currentDate() + "')";

    if(mysql_query(conn,query.c_str())==0){   

    LoanQ.changestates(id, 3); // deny
    LoanSSL.changestates(id, 3); // deny
    LoanQ.remove();
    if(mysql_query(conn, query4.c_str()) == 0){
        NotfiSLL.insertAtB(mysql_insert_id(conn), email, message, 0, currentDate());
    } else {
        cout << "❌ Loan denial Notification insertion failed: " << mysql_error(conn) << endl;
    }
        return crow::response(200, "State updated");

        }


    return crow::response(200, "denied"); });

    CROW_ROUTE(app, "/api/admin/get-all-loans-history")
        .methods("GET"_method)([]()
                               { return crow::response(200, LoanSSL.getAllLoansJSON()); });

    CROW_ROUTE(app, "/api/client/get-loans-history")
        .methods("GET"_method)([](const crow::request &req)
                               {
    auto email = req.url_params.get("email");
    return crow::response(200, LoanSSL.getLoansByEmailJSON(email)); });
}

//!-----------------------
void setupFixedRoutes(crow::SimpleApp &app)
{
    CROW_ROUTE(app, "/api/submit-fixed-request")
        .methods("POST"_method, "OPTIONS"_method)([](const request &req)
                                                  {
                                                      if (req.method == "OPTIONS"_method)
                                                          return crow::response(200);
                                                      json::rvalue data = json::load(req.body);
                                                      if (!data)
                                                          return response(400, "Invalid JSON");
                                                      string email = data.has("email") ? (string)data["email"].s() : (string) "";
                                                      string duration = data.has("duration") ? (string)data["duration"].s() : (string) "";
                                                      long long int profit = data.has("profit") ? data["profit"].i() : 0;
                                                      long long int totalamount = data.has("amount") ? data["amount"].i() : 0;

                                                      if (!userList.checkIfUserExist(email))
                                                      {
                                                          cout << 1;
                                                          json::wvalue err;
                                                          err["message"] = "the user not exist";
                                                          return crow::response(400, err);
                                                      }
                                                      string query = "INSERT INTO Fixed (email,duration,amount,profit,fixed_date,status) VALUES('" + email + "','" + duration + "','" + to_string(totalamount) + "','" + to_string(profit) + "','" + currentDate() + "', 2)";
                                                      if (mysql_query(conn, query.c_str()) == 0)
                                                      {
                                                          int id = mysql_insert_id(conn);
                                                          FixedQ.insert(id, email, duration, totalamount, profit, currentDate(), 2);
                                                          FixedSSL.insertAtL(id, email, duration, totalamount, profit, currentDate(), 2 , 0);
                                                          return crow::response(200, "ok");
                                                      }
                                                      else
                                                      {
                                                          json::wvalue err;
                                                          err["message"] = mysql_error(conn);
                                                          return crow::response(400, err);
                                                      } });

    CROW_ROUTE(app, "/api/admin/get-all-fixed")
        .methods("GET"_method)([]()
                               { return crow::response(200, FixedQ.getAllFixedJSON()); });

    CROW_ROUTE(app, "/api/admin/approve-fixed")
        .methods("POST"_method, "OPTIONS"_method)([](const crow::request &req)
                                                  {
    if (req.method == "OPTIONS"_method) return crow::response(200);

    auto data = crow::json::load(req.body);
    if (!data) return crow::response(400, "Invalid JSON");

    int id = data["id"].i();
    vector<string> data1 = FixedQ.getEmailAndMoney(id);
    if (data1.size() < 2) {
    return crow::response(400, "ID not found in FixedQueue");
    }
    string email = data1[0];
    string amount = data1[1];
        json::wvalue account_B =userList.getDataByEmail(email);
    string temp=account_B.dump();
    json::rvalue account = json::load(temp);
    string accountNo = account.has("accountNumber") ? (string)account["accountNumber"].s() : (string)"";

           string  query = "INSERT INTO transactions (senderAccount, receiverAccount, amount, date) VALUES ('" + accountNo + "','BANK' , " + amount + ", '" + currentDate() + "')";

        if(mysql_query(conn, query.c_str()) != 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
                query = "SELECT id FROM transactions WHERE senderAccount = '" + accountNo + "' AND receiverAccount = 'BANK' AND amount = " + amount + " ORDER BY id DESC LIMIT 1";
        if(mysql_query(conn, query.c_str())!= 0)
        {
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
            
        MYSQL_RES* res = mysql_store_result(conn);
        MYSQL_ROW row = mysql_fetch_row(res);
        int transactionId = stoi(row[0]);
        mysql_free_result(res);

    long long amountInt = stoll(amount);
    
    query = "UPDATE Fixed SET status = 1 WHERE id = " + to_string(id);
    string query2 = "UPDATE users SET balance = balance - " + to_string(amountInt) + " WHERE email = '" + email + "'";
        if(!userList.sendMoney(accountNo, "BANK", amountInt)){
            json::wvalue response;
            response["status"] = "error";
            response["message"] = "Transaction failed .....YOU DON'T HAVE ENOUGH BALANCE";
            return crow::response(400, response);
        }
        string messageApproved = "Dear customer, we are pleased to inform you that your fixed deposit request with ID " 
                            + to_string(id) + 
                            " has been successfully approved. The deposit is now active according to the agreed terms.";

        string queryApproved = "INSERT INTO notifications (user, message, status, createdAt) VALUES ('" + email + "', '" + messageApproved + "', 0, '" + currentDate() + "')";

        
    if(mysql_query(conn,query.c_str())==0 && mysql_query(conn,query2.c_str())==0){               
    transactionList.insertTransaction(transactionId,  accountNo,"BANK", amountInt, currentDate());
    FixedQ.changestatus(id, 1); // approveds
    FixedSSL.changeStatusByid(id, 1); // approveds
    FixedQ.remove();
    if(mysql_query(conn, queryApproved.c_str()) == 0){
        NotfiSLL.insertAtB(mysql_insert_id(conn), email, messageApproved, 0, currentDate());
    } else {
        cout << "❌ Fixed deposit approval Notification insertion failed: " << mysql_error(conn) << endl;
    }

        return crow::response(200, "State updated");
        
        }
        else{
                json::wvalue err;
                err["message"]=mysql_error(conn);
                return crow::response(400,err);
            }


    return crow::response(200, "approved"); });

    ////////////////////////////////
    CROW_ROUTE(app, "/api/admin/deny-fixed")
        .methods("POST"_method, "OPTIONS"_method)([](const crow::request &req)
                                                  {
    if (req.method == "OPTIONS"_method) return crow::response(200);

    auto data = crow::json::load(req.body);
    if (!data) return crow::response(400, "Invalid JSON");
    
    int id = data["id"].i();
    string query = "UPDATE Fixed SET status = 3 WHERE id = " + to_string(id);

    string messageDenied = "Dear customer, we regret to inform you that your fixed deposit request with ID " 
                       + to_string(id) + 
                       " has not been approved at this time. Please contact customer support for further details.";
    string email = FixedSSL.getEmailById(id);
    if(email.empty()) {
        return crow::response(400, "Fixed deposit ID not found");
    }
    string queryDenied = "INSERT INTO notifications (user, message, status, createdAt) VALUES ('" + email + "', '" + messageDenied + "', 0, '" + currentDate() + "')";


    if(mysql_query(conn,query.c_str())==0){   

    FixedQ.changestatus(id, 3); // deny
    FixedSSL.changeStatusByid(id, 3); // deny
    FixedQ.remove();
    if(mysql_query(conn, queryDenied.c_str()) == 0){
        NotfiSLL.insertAtB(mysql_insert_id(conn), email, messageDenied, 0, currentDate());
    } else {
        cout << "❌ Fixed deposit denial Notification insertion failed: " << mysql_error(conn) << endl;
    }
        return crow::response(200, "State updated");

        }


    return crow::response(200, "denied"); });

    CROW_ROUTE(app, "/api/admin/get-all-fixed-history")
        .methods("GET"_method)([]()
                               { return crow::response(200, FixedSSL.getAllFixedJSON()); });

    CROW_ROUTE(app, "/api/client/get-fixed-history")
        .methods("POST"_method)([](const crow::request &req)
                                {
    crow::json::rvalue data = crow::json::load(req.body);
    if (!data) return crow::response(400, "Invalid JSON");
    string email = data.has("email") ? (string)data["email"].s() : (string)"";
    return crow::response(200, FixedSSL.getFixedByEmailJSON(email)); });
}
//!-----------------------------------

void setupBranchRoutes(crow::SimpleApp &app)
{

    CROW_ROUTE(app, "/api/admin/branches")
        .methods("GET"_method, "POST"_method, "PUT"_method, "DELETE"_method)([&](const crow::request &req)
                                                                             {

       
        if (req.method == "GET"_method)
        {
            return crow::response(branchList.getAll());
        }

        auto body = crow::json::load(req.body);
        if (!body)
            return crow::response(400, "Invalid JSON");

        if (req.method == "POST"_method)
        {
            string query = "INSERT INTO branches ( branch_name, location_link, phone, address) VALUES ('" +
                           (string)body["name"].s() + "', '" +
                           (string)body["location_link"].s() + "', '" +
                           (string)body["phone"].s() + "', '" +
                           (string)body["address"].s() + "')";
            if (mysql_query(conn, query.c_str()) != 0)
            {
                string errorMsg = mysql_error(conn);
                cout << "MySQL Query Error: " << errorMsg << endl;
                crow::json::wvalue response;
                response["status"] = "error";
                response["message"] = "somthing went wrong" + errorMsg;
                return crow::response(400, response);
            }
            query="SELECT id FROM branches ORDER BY id DESC LIMIT 1";
        if(mysql_query(conn,query.c_str())!= 0){
            string errorMsg = mysql_error(conn);
            cout << "MySQL Query Error: " << errorMsg << endl;
            crow::json::wvalue response;
            response["status"] = "error";
            response["message"] = "somthing went wrong" + errorMsg;
            return crow::response(400, response);
        }
        MYSQL_RES* res = mysql_store_result(conn);
        MYSQL_ROW row = mysql_fetch_row(res);
        int branchId = stoi(row[0]);
        mysql_free_result(res);
            
            branchList.insert(
                branchId,
                (string)body["name"].s(),
                (string)body["location_link"].s(),
                (string)body["phone"].s(),
                (string)body["address"].s()
            );
            return crow::response(201, "Branch added");
        }

        if (req.method == "PUT"_method)
        {
            int id = body["id"].i();

            if (!branchList.removeById(id))
                return crow::response(404, "Branch not found");

            branchList.insert(
                id,
            (string)body["name"].s(),
                (string)body["location_link"].s(),
                (string)body["phone"].s(),
                (string)body["address"].s()
            );
            return crow::response("Branch updated");
        }

       
        if (req.method == "DELETE"_method)
        {
            int id = body["id"].i();

            if (!branchList.removeById(id))
                return crow::response(404, "Branch not found");

            return crow::response("Branch deleted");
        }

        return crow::response(405); });

    CROW_ROUTE(app, "/api/user/branches").methods("GET"_method)([&]()
                                                                {
        crow::json::wvalue result;
        result = branchList.getAll();

        return crow::response(200,result); });
}

void checktimeroute(crow::SimpleApp &app)
{
    CROW_ROUTE(app, "/api/check-loan-time").methods("POST"_method)([](const crow::request &r)
                                                                   {
        LoanSSL.checklate();    
        return crow::response(200, "ok"); });

    CROW_ROUTE(app, "/api/check-fixed-time").methods("POST"_method, "OPTIONS"_method)([](const crow::request &r)
                                                                                      {
        if (r.method == "OPTIONS"_method) return crow::response(200);
        crow::json::wvalue data = FixedSSL.checktime(); 
        string temp=data.dump();
        json::rvalue res = json::load(temp);
        int size = res.size();
        for(int i=0; i<size; i++){
            int id = res[i]["id"].i();
            string email = res[i]["email"].s();
            string accountNumber = res[i]["accountNumber"].s();
            string duration = res[i]["duration"].s();
            long long int amount = res[i]["amount"].i();
            long long int profit = res[i]["profit"].i();
            int monthsPaid = res[i]["monthsPaid"].i();
            int durationMonths = res[i]["durationMonths"].i();
            int numberOfProfitsToPay = res[i]["numberOfProfitsToPay"].i();
            long long int totalProfitPaid = res[i]["totalProfitPaid"].i();
                        string query  = "UPDATE Fixed SET number_of_profit = " + to_string(numberOfProfitsToPay) +
                            " WHERE id = " + to_string(id);
            string query2 = "UPDATE users SET balance = balance + " + to_string(totalProfitPaid) +
                            " WHERE email = '" + email + "'";
            string query3 = "INSERT INTO transactions (senderAccount, receiverAccount, amount, date) "
                            "VALUES ('BANK', '" + accountNumber + "', " +
                            to_string(totalProfitPaid) + ", '" + currentDate() + "')"; 
            string message = "Dear customer, your fixed profit has been credited. Total profit amount: " + to_string(totalProfitPaid);
            string query4 = "INSERT INTO notifications (user, message, status , createdAt) VALUES ('" + email + "', '" + message + "', 0, '" + currentDate() + "')";
            if (mysql_query(conn, query.c_str()) == 0 &&
                mysql_query(conn, query2.c_str()) == 0 &&
                mysql_query(conn, query3.c_str()) == 0) {

                FixedSSL.chandeNuOfProfitsById(id, numberOfProfitsToPay);
                transactionList.insertTransaction(mysql_insert_id(conn),
                                                   "BANK", accountNumber,
                                                   totalProfitPaid, currentDate());
                userList.sendMoney("BANK", accountNumber, totalProfitPaid);
                if(mysql_query(conn, query4.c_str()) == 0)
                NotfiSLL.insertAtB(mysql_insert_id(conn), email, message, 0, currentDate());
                else
                cout << "❌ Profit Notification insertion failed: " << mysql_error(conn) << endl;
            }
            else {
                cout << "❌ Profit transaction failed: " << mysql_error(conn) << endl;
            }
                if (numberOfProfitsToPay == durationMonths) {

                string query4 = "UPDATE Fixed SET status = 0 WHERE id = " + to_string(id);
                string query5 = "UPDATE users SET balance = balance + " + to_string(amount) +
                                " WHERE email = '" + email + "'";

                string query6 = "INSERT INTO transactions (senderAccount, receiverAccount, amount, date) "
                                "VALUES ('BANK', '" + accountNumber + "', " +
                                to_string(amount) + ", '" + currentDate() + "')";

                string message2 = "Dear customer, your fixed deposit with ID " + to_string(id) + 
                                " has matured. The amount of " + to_string(amount) + 
                                " has been successfully returned to your account.";


                string query7 = "INSERT INTO notifications (user, message, status, createdAt) VALUES ('" + email + "', '" + message2 + "', 0, '" + currentDate() + "')";


                if (mysql_query(conn, query4.c_str()) == 0 &&
                    mysql_query(conn, query5.c_str()) == 0 &&
                    mysql_query(conn, query6.c_str()) == 0) {

                    FixedSSL.changeStatusByid(id, 0);
                    transactionList.insertTransaction(mysql_insert_id(conn),
                                                       "BANK", accountNumber,
                                                       amount, currentDate());
                    userList.sendMoney("BANK", accountNumber, amount);
                    if(mysql_query(conn, query7.c_str()) == 0)
                    NotfiSLL.insertAtB(mysql_insert_id(conn), email, message2, 0, currentDate());
                    else
                    cout << "❌ Maturity Notification insertion failed: " << mysql_error(conn) << endl;
                }
                else {
                    cout << "❌ Maturity transaction failed: " << mysql_error(conn) << endl;
                }
            }
        }
        crow::json::wvalue response;
        response["message"] = "ok";

        return crow::response(200, response); });
}

void setupNotfiRoutes(crow::SimpleApp &app)
{
    CROW_ROUTE(app, "/api/client/get-notifications")
        .methods("GET"_method)([](const crow::request &req)
                               {
        auto email = req.url_params.get("email");
        if (!email) return crow::response(400, "Missing email");
        return crow::response(200, NotfiSLL.getNotfiByEmailJSON(email)); });

    CROW_ROUTE(app, "/api/notifications/read")
        .methods("POST"_method)([](const crow::request &req)
                                {
                                    auto data = crow::json::load(req.body);
                                    if (!data)
                                        return crow::response(400, "Invalid JSON");
                                    int id = data["id"].i();
                                    string query = "UPDATE notifications SET status = 1 WHERE id = " + to_string(id);
                                    if (mysql_query(conn, query.c_str()) == 0)
                                    {
                                        NotfiSLL.changestates(id, 1);
                                    }
                                    else
                                    {
                                        crow::json::wvalue err;
                                        err["message"] = mysql_error(conn);
                                        return crow::response(400, err);
                                    }
                                    return crow::response(200, "Notification marked as read");
                                });

    CROW_ROUTE(app, "/api/notifications/read-all")
        .methods("POST"_method)([](const crow::request &req)
                                {
        auto data = crow::json::load(req.body);
        if (!data) return crow::response(400, "Invalid JSON");
        string email = data["email"].s();
        string query = "UPDATE notifications SET status = 1 WHERE user = '" + email + "'";
        if(mysql_query(conn, query.c_str()) == 0){
            NotfiSLL.changeallstates(email , 1);
        } else {
            crow::json::wvalue err;
            err["message"] = mysql_error(conn);
            return crow::response(400, err);
        }
        return crow::response(200, "Notifications marked as read"); });
}