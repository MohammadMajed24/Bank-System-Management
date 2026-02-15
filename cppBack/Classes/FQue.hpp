#pragma once
#include <iostream>
#include<crow.h>
#include <vector>
#include <string>
using namespace std;

class FixedQueue {
    private:
    struct FixedNode{
    int id;
    string email;
    string duration;
    long long int amount;
    long long int profit;
    string date; 
    int status;
    FixedNode* next=nullptr;
    };

    public:
    FixedNode* head;
    FixedNode* tail;
    int len;

    FixedQueue() {
        head = nullptr;
        tail = nullptr;
    }

    string insert(int id, string email, string duration , long long int amount , long long int profit, string date, int status);
    crow::json::wvalue getFixedByid(int id);
    crow::json::wvalue getAllFixedJSON();
    void changestatus(int id, int newStatus);
    vector<string> getEmailAndMoney(int id);   
    void deleteNodeById(int id);
    void remove();
    bool isEmpty();
    void display();
};
