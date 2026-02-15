#pragma once
#include <iostream>
#include <string>
#include<crow.h>
#include <vector>
using namespace std;


class FixedSLL {
    private:
    struct FixedNode{
    int id;
    string email;
    string duration;
    long long int amount;
    long long int profit;
    string date;
    int status;
    int nu_of_profits;
    FixedNode* next=nullptr;

    };
    public:
    FixedNode* head;
    FixedNode* tail;
    int len;

    FixedSLL() {
        head = nullptr;
        tail = nullptr;
    }

    string insertAtB(int id, string email, string duration , long long int amount , long long int profit, string date ,int status , int nu_of_profits);
    string insertAtL(int id, string email, string duration , long long int amount , long long int profit, string date , int status , int nu_of_profits);
    FixedNode* getNodeByEmail(string email);
    void changeStatusByid(int id, int newStatus);
    void chandeNuOfProfitsById(int id, int newNuOfProfits);
    crow::json::wvalue getAllFixedJSON();
    crow::json::wvalue getFixedByEmailJSON(string email);
    string getEmailById(int id);
    crow::json::wvalue checktime();
    int monthsPassed(const string& startDate);
    void deleteNodeByEmail(string email);
    bool isEmpty();
    void display();
};