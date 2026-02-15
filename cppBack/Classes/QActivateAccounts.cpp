#include "QActivateAccounts.hpp"
#include<iostream>
#include<string>
#include<crow.h>
#include<vector>

using namespace std;

QActivateAccounts::QActivateAccounts(){
    front = nullptr;
    back = nullptr;
}


void QActivateAccounts::addAccount(string name, string email, string creationDate){
    Node* newNode=new Node();
    newNode->name=name;
    newNode->email=email;
    newNode->creationDate=creationDate;
    if(front==nullptr){
        front=newNode;
        back=newNode;
    }
    else{
        back->next=newNode;
        back=newNode;
    }
}

void QActivateAccounts::removeAccount(){
    if(isEmpty()) return;
    Node *temp=front;
    front=front->next;
    if (front == nullptr) {
        back = nullptr;
    }
    delete temp;
}


crow::json::wvalue QActivateAccounts::getAccountsJSON(){
    vector<crow::json::wvalue> accountsList;
    Node *temp=front;
    while(temp!=nullptr){
        crow::json::wvalue account;
        account["name"] = temp->name;
        account["email"] = temp->email;
        account["creationDate"] = temp->creationDate;
        accountsList.push_back(account);
        temp=temp->next;
    }
    return crow::json::wvalue(accountsList);
}

bool QActivateAccounts::isEmpty(){
    return front==nullptr;
}

string QActivateAccounts::getFront(){
    if(isEmpty()) return "";
    return front->email;
}
