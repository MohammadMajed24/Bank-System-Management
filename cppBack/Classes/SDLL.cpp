#include "SDLL.hpp"
#include "../globals.hpp"
#include <iostream>
#include <string>
#include <random>
#include <vector>

using namespace std;

string SLL::insertAtB(string name1, string name2, string nationalID, string birthdate, string email, string phone, string password, string address, string job, string accountType,string currentDate,long long int balance,string accountNumber,string status="hold")
{
    Node *newNode = new Node();
    newNode->name1 = name1;
    newNode->name2 = name2;
    newNode->nationalID = nationalID;
    newNode->birthdate = birthdate;
    newNode->email = email;
    newNode->phone = phone;
    newNode->password = password;
    newNode->address = address;
    newNode->job = job;
    newNode->accountType = accountType;
    newNode->balance = balance;
    newNode->status = status;
    newNode->createAt = currentDate;
    newNode->accountNumber=accountNumber;
    newNode->token = generateToken();
    count++;

    if (head == nullptr)
    {
        head = tail = newNode;
        return newNode->token;
    }
    newNode->next = head;
    head = newNode;
    return newNode->token;
}
void SLL::display()
{
    if (head == nullptr)
    {
        cout << "List is empty" << endl;
        return;
    }
    Node *cur = head;
    while (cur != nullptr)
    {
        cout << cur->name1 << " " << cur->name2 << " " << cur->nationalID << " " << cur->birthdate << " " << cur->email << " " << cur->phone << " " << cur->password << " " << cur->address << " " << cur->job << " " << cur->accountType << endl;
        cur = cur->next;
    }
}
string* SLL::validateLogin(string email, string password)
{
    Node *cur = head;
   
    while (cur != nullptr)
    {
        if (cur->email == email && cur->password == password)
        {
            cur->token = generateToken();
            string *lst=new string[17];
            lst[0]=(string)cur->name1;
            lst[1]=(string)cur->name2;
            lst[2]=(string)cur->nationalID;
            lst[3]=(string)cur->birthdate;
            lst[4]=(string)cur->email;
            lst[5]=(string)cur->phone;
            lst[6]=(string)cur->password;
            lst[7]=(string)cur->address;
            lst[8]=(string)cur->job;
            lst[9]=(string)cur->accountType;
            lst[10]=(string)cur->token;
            lst[11]=(string)cur->createAt;
            lst[12]=(string)cur->status;
            lst[13]=to_string(cur->balance);
            lst[14]=(string)cur->accountNumber;
            lst[15]=(string)cur->createAt;
            lst[16]=(string)cur->status;
            return lst;
           
        }
        cur = cur->next;
    }
    return nullptr;
}


void SLL::deleteNodeByEmail(string email) {
    if(isEmpty()){
        return;
    }
    Node *cur = head;
    Node *prev = nullptr;
    while (cur != nullptr) {
        if (cur->email == email) {
            if (cur == head) {
                head = cur->next;
            } else {
                prev->next = cur->next;
            }
            if (cur == tail) {
                tail = prev;
            }
            delete cur;
            count--;
            return;
        }
        prev = cur;
        cur = cur->next;
    }
}

bool SLL::isEmpty() {
    return head == nullptr;
}



SLL::Node* SLL::getNodeByEmail(string email)
{
    Node *cur = head;
    while (cur != nullptr)
    {
        if (cur->email == email)
        {
            return cur;
        }
        cur = cur->next;
    }
    return nullptr;
}

string SLL::generateToken()
{
    static random_device rd;
    static mt19937 gen(rd());
    static uniform_int_distribution<> dis(0,25);
    string token = "";
    for(int i=0;i<26;i++){
        token+=(char)('A'+ dis(gen));
    }
    return token;
}

string SLL::generateRandomInteger(int length)
{
    string numbers="0123456789";
    string result="";
    random_device rd;
    mt19937 gen(rd()); //! ref :https://stackoverflow.com/questions/19665818/generate-random-numbers-using-c11-random-library
    uniform_int_distribution<> dis(0,numbers.size()-1);
    for(int i=0;i<length;i++){
        result+=numbers[dis(gen)];
    }
    return result;
}

string SLL::createAccountNumber(string accountType){
    string randomPart=generateRandomInteger(7);
    string accoutType=(accountType=="savings")?"SAVINGS":"CURRENT";
    string accoutNumber =accoutType + randomPart;
    return accoutNumber;
}





crow::json::wvalue SLL::getDataByEmail(string email){
    if(isEmpty()){
        return crow::json::wvalue({{"message","List is empty"}});
    }
    crow::json::wvalue userData;
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            userData["name1"]=cur->name1;
            userData["name2"]=cur->name2;
            userData["nationalID"]=cur->nationalID;
            userData["email"]=cur->email;
            userData["balance"]=cur->balance;
            userData["accountNumber"]=cur->accountNumber;
            userData["accountType"]=cur->accountType;
            userData["status"]=cur->status;
            return userData;
            }
            cur=cur->next;
    }
    return crow::json::wvalue({{"message","User not found"}});
}

SLL::Node* SLL::getNodeByAccountNumber(string accountNumber){
    Node *cur = head;
    while (cur != nullptr)
    {
        if (cur->accountNumber == accountNumber)
        {
            return cur;
        }
        cur = cur->next;
    }
    return nullptr;
}

string SLL::getEmailbyAccountNumber(string accountNumber){
    Node *cur = head;
    while (cur != nullptr)
    {
        if (cur->accountNumber == accountNumber)
        {
            return cur->email;
        }
        cur = cur->next;
    }
    return "";
}

bool SLL::sendMoney(string SenderAccountNumber,string ReceiverAccountNumber,long long int amount){
    Node* senderNode=getNodeByAccountNumber(SenderAccountNumber);
    Node* receiverNode=getNodeByAccountNumber(ReceiverAccountNumber);
    if(senderNode==nullptr || receiverNode==nullptr){
        return false;
    }
    if(senderNode->balance<amount){
        return false;
    }
    senderNode->balance-=amount;
    receiverNode->balance+=amount;
    senderBalance+=amount;
    return true;
}

bool SLL::checkIfUserExist(string email){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            return 1;
        }
        cur=cur->next;
    }
    return 0;
}



bool SLL::checkIfAdmin(string email){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            if(cur->nationalID=="123456789123"){
                return true;
            }
            else{
                return false;
            }
        }
        cur=cur->next;
    }
    return false;
}



void SLL::updatePassword(string email, string newPassword){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            cur->password=newPassword;
            return;
        }
        cur=cur->next;
    }
}



bool SLL::checkPassword(string email, string password){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            if(cur->password==password){
                return true;
            }
            else{
                return false;
            }
        }
        cur=cur->next;
    }
    return false;
}

string SLL::getAccountnu(string email){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            return cur->accountNumber;
        }
        cur=cur->next;
    }
    return "";
}

int SLL::getTotalBalance(){
    return senderBalance;
}
int SLL::getUserCount(){
    return count;
}
void SLL::setTotalBalance(long long int balance){
    senderBalance=balance;
}
long long int SLL::getUserBalance(string email){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            return cur->balance;
        }
        cur=cur->next;
    }
    return -1; // not found
}

crow::json::wvalue SLL::getAllData(){
    Node* cur=head;
    vector<crow::json::wvalue> usersList;
    while(cur!=nullptr){
        crow::json::wvalue userData;
        userData["name1"]=cur->name1;
        userData["name2"]=cur->name2;
        userData["nationalID"]=cur->nationalID;
        userData["email"]=cur->email;
        userData["balance"]=cur->balance;
        userData["accountNumber"]=cur->accountNumber;
        userData["accountType"]=cur->accountType;
        userData["status"]=cur->status;
        usersList.push_back(move(userData));
        cur=cur->next;
 
    }
    return crow::json::wvalue(usersList);
}

bool SLL::isActive(string accountNumber){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->accountNumber==accountNumber){
            if(cur->status=="active"){
                return true;
            }
            else{
                return false;
            }
        }
        cur=cur->next;
    }
    return false;
}
bool SLL::isActiveByEmail(string email){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            if(cur->status=="active"){
                return true;
            }
            else{
                return false;
            }
        }
        cur=cur->next;
    }
    return false;
}













string SLL::getNodeByAccountNumberByEmail(string email){
    Node* cur=head;
    while(cur!=nullptr){
        if(cur->email==email){
            return cur->accountNumber;
        }
        cur=cur->next;
    }
    return "";
}