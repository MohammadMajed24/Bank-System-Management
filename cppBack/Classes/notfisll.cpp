#include "notfisll.hpp"
#include "../globals.hpp"
#include <iostream>
#include <string>
#include <crow.h>
#include <vector>
#include <mysql.h>
#include <random>

using namespace std;

string notfsll::insertAtB(int id, string email,  string message ,int states, string date) {
    NotfNode* newNode = new NotfNode();
    newNode->id = id;
    newNode->email = email;
    newNode->states = states;
    newNode->message = message;
    newNode->date = date;

    if (isEmpty()) {
        head = newNode;
        tail = newNode;
    } else {
        newNode->next = head;
        head = newNode;
    }
    len++;
    return to_string(newNode->id);
}

string notfsll::insertAtL(int id, string email, string message, int states, string date) {
    NotfNode* newNode = new NotfNode();
    newNode->id = id;
    newNode->email = email;
    newNode->states = states;
    newNode->message = message;
    newNode->date = date;

    if (isEmpty()) {
        head = newNode;
        tail = newNode;
    } else {
        tail->next = newNode;
        tail = newNode;
    }
    len++;
    return to_string(newNode->id);
}

crow::json::wvalue notfsll::getNotfiByEmailJSON(string email) {
    vector<crow::json::wvalue> loansList;

    NotfNode* temp = head;
    while (temp != nullptr) {
        if (temp->email == email) {
            crow::json::wvalue loan;
            loan["id"] = temp->id;
            loan["states"] = temp->states;
            loan["message"] = temp->message;
            loan["date"] = temp->date;

            loansList.push_back(move(loan));
        }
        temp = temp->next;
    }
    return crow::json::wvalue(loansList);
}

bool notfsll::checkIfIdExit(int id) {
    NotfNode* temp = head;
    while (temp != nullptr) {
        if (temp->id == id) {
            return true;
        }
        temp = temp->next;
    }
    return false;
}

void notfsll::changestates(int id, int newState) {
    NotfNode* temp = head;
    while (temp != nullptr) {
        if (temp->id == id) {
            temp->states = newState;
            return;
        }
        temp = temp->next;
    }
}

void notfsll::changeallstates(string email ,int newState) {
    NotfNode* temp = head;
    while (temp != nullptr) {
        if (temp->email == email) {
            temp->states = newState;
        }
        temp = temp->next;
    }
}

bool notfsll::isEmpty() {
    return head == nullptr;
}

void notfsll::display() {
    NotfNode* temp = head;
    while (temp != nullptr) {
        cout << "ID: " << temp->id << ", Email: " << temp->email << ", Message: " << temp->message << ", States: " << temp->states << endl;
        temp = temp->next;
    }
}


