#pragma once
#include <iostream>
#include <string>
#include <vector>
#include <ctime>
#include <crow.h>

using namespace std;


class notfsll {
    private:
    struct NotfNode{
    int id;
    string email;
    string message;
    int states;
    string date;

    NotfNode* next=nullptr;
    };
    public:
    NotfNode* head;
    NotfNode* tail;
    int len;

    notfsll() {
        head = nullptr;
        tail = nullptr;
    }

    string insertAtB(int id, string email, string message, int states, string date);
    string insertAtL(int id, string email, string message, int states, string date);
    crow::json::wvalue getNotfiByEmailJSON(string email);
    bool checkIfIdExit(int id);
    void changestates(int id, int newState);
    void changeallstates(string email ,int newState);
    bool isEmpty();
    void display();
};