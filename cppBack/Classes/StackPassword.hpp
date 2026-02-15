#pragma once 
#include<iostream>
#include<string>
#include<crow.h>
using namespace std;

class StackPassword {
    struct Node {
        string email;
        string password;
        Node* next;
    };
    Node* top;
public:
    StackPassword() {
        top = nullptr;
    }
    void pushRequest(const string password, string email);
    void popRequest();
    crow::json::wvalue getAllData();
    bool isEmpty();
};