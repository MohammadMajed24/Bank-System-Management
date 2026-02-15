#include "LQue.hpp"
#include "../globals.hpp"
#include <iostream>
#include <crow.h>
#include <vector>
#include <string>
#include <random>
#include <ctime>

using namespace std;

string LoanQueue::insert(int id, string email, int states, string duration, string loan_cost, string date) {
    LoanNode* newNode = new LoanNode();
    newNode->id = id;
    newNode->email = email;
    newNode->states = states;
    newNode->duration = duration;
    newNode->loan_cost = loan_cost;
    newNode->date = date;
    newNode->next = nullptr;

    if (head == nullptr) {
        head = tail = newNode;
    }
    else {
        tail->next = newNode;
        tail = newNode;
    }

    len++;
    return "Inserted Successfully!";
}

bool LoanQueue::isEmpty() {
    return head == nullptr;
}

crow::json::wvalue LoanQueue::getNodeByid(int id) {
    vector<crow::json::wvalue> accountbyid;
    LoanNode* temp = head;
    while (temp != nullptr) {
        if (temp->id == id) {
        crow::json::wvalue account;
            account["id"] = temp->id;
            account["email"] = temp->email;
            account["states"] = temp->states;
            account["duration"] = temp->duration;
            account["loan_cost"] = temp->loan_cost;
            account["date"] = temp->date;
            return account;
        }
        temp = temp->next;
    }
    return nullptr;
}

void LoanQueue::changestates(int id, int newState) {
    LoanNode* temp = head;
    while (temp != nullptr) {
        if (temp->id == id) {
            temp->states = newState;
            return;
        }
        temp = temp->next;
    }
}

void LoanQueue::deleteNodeById(int id) {
    if (isEmpty()) return;

    LoanNode* temp = head;
    LoanNode* prev = nullptr;

    if (head->id == id) {
        head = head->next;
        delete temp;
        len--;
        if (head == nullptr) tail = nullptr;
        return;
    }


    while (temp != nullptr && temp->id != id) {
        prev = temp;
        temp = temp->next;
    }

    if (temp == nullptr) return; 

    prev->next = temp->next;
    if (temp == tail) tail = prev;

    delete temp;
    len--;
}

void LoanQueue::display() {
    if (isEmpty()) {
        cout << "Loan Queue is empty.\n";
        return;
    }

    LoanNode* temp = head;

    cout << "---------------- Loan Queue ----------------\n";
    while (temp != nullptr) {
        cout << "ID: " << temp->id
             << " | Email: " << temp->email
             << " | States: " << temp->states
             << " | Duration: " << temp->duration
             << " | Cost: " << temp->loan_cost
             << " | Date: " << temp->date
             << endl;

        temp = temp->next;
    }
    cout << "--------------------------------------------\n";
}
void LoanQueue::remove() {
    if (isEmpty()) {
        return; 
    }

    LoanNode* temp = head;   
    head = head->next;       

    if (head == nullptr) {
        tail = nullptr;
    }

    len--;

    temp->next = nullptr;
}


vector<std::string> LoanQueue::getEmailAndMoney(int id) {
    LoanNode* cur = head;

    while (cur != nullptr) {
        if (cur->id == id) {
            return {cur->email, cur->loan_cost};
        }
        cur = cur->next;
    }

    return {"", ""};
}


crow::json::wvalue LoanQueue::getAllLoansJSON() {
    vector<crow::json::wvalue> loansList;

    LoanNode* temp = head;
    while (temp != nullptr) {
        crow::json::wvalue loan;
        loan["id"] = temp->id;
        loan["email"] = temp->email;
        loan["states"] = temp->states;
        loan["duration"] = temp->duration;
        loan["loan_cost"] = temp->loan_cost;
        loan["date"] = temp->date;

        loansList.push_back(move(loan));
        temp = temp->next;
    }

    return crow::json::wvalue(loansList);
}


int LoanQueue::getTotalLoanRequest() {
    return len;
}


