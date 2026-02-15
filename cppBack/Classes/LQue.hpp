#pragma once
#include <iostream>
#include<crow.h>
#include <vector>
#include <string>
#include <ctime>
using namespace std;
// afawfawfa f
class LoanQueue {
    private:
    struct LoanNode{
    int id;
    string email;
    int states;
    string duration;
    string loan_cost;
    string date;
    LoanNode* next=nullptr;
    };

    public:
    LoanNode* head;
    LoanNode* tail;
    int len;

    LoanQueue() {
        head = nullptr;
        tail = nullptr;
    }

    string insert(int id, string email, int states, string duration, string loan_cost, string date);
    void changestates(int id, int newState);
    crow::json::wvalue getNodeByid(int id);
    vector<std::string> getEmailAndMoney(int id);
    crow::json::wvalue getAllLoansJSON();
    void deleteNodeById(int id);
    void remove();
    int getTotalLoanRequest();
    bool isEmpty();
    void display();
};