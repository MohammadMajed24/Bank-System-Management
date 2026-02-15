#pragma once
#include<iostream>
#include<crow.h>
using namespace std;

class QActivateAccounts
{
    struct Node{
        string name;
        string email;
        string creationDate;
        Node *next=nullptr;

    };
    Node *front;
    Node *back;
public:
    QActivateAccounts();
    void addAccount(string name, string email, string creationDate);
    void removeAccount();
    crow::json::wvalue getAccountsJSON();
    string getFront();
    bool isEmpty();


    
};