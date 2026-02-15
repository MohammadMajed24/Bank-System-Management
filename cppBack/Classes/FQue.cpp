#include "FQue.hpp"
#include "../globals.hpp"
#include <iostream>
#include <crow.h>
#include <vector>
#include <string>
#include <random>

using namespace std;

string FixedQueue::insert(int id, string email, string duration, long long int amount, long long int profit, string date , int status) {
    FixedNode* newNode = new FixedNode();
    newNode->id = id;
    newNode->email = email;
    newNode->duration = duration;
    newNode->amount = amount;
    newNode->status = status;
    newNode->profit = profit;
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

bool FixedQueue::isEmpty() {
    return head == nullptr;
}

crow::json::wvalue FixedQueue::getFixedByid(int id) {
    vector<crow::json::wvalue> accountbyid;
    FixedNode* temp = head;
    while (temp != nullptr) {
        if (temp->id == id) {
        crow::json::wvalue account;
            account["id"] = temp->id;
            account["email"] = temp->email;
            account["duration"] = temp->duration;
            account["amount"] = temp->amount;
            account["profit"] = temp->profit;
            account["status"] = temp->status;
            account["date"] = temp->date;
            return account;
        }
        temp = temp->next;
    }
    return nullptr;
}


void FixedQueue::deleteNodeById(int id) {
    if (isEmpty()) return;

    FixedNode* temp = head;
    FixedNode* prev = nullptr;  
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

void FixedQueue::display() {
    if (isEmpty()) {
        cout << "Fixed Queue is empty.\n";
        return;
    }

    FixedNode* temp = head;
    cout << "---------------- Fixed Queue ----------------\n";
    while (temp != nullptr) {
        cout << "ID: " << temp->id
             << " | Email: " << temp->email
             << " | Duration: " << temp->duration
             << " | Amount: " << temp->amount
             << " | Profit: " << temp->profit
             << " | Status: " << temp->status
             << " | Date: " << temp->date

             << endl;

        temp = temp->next;
    }
    cout << "--------------------------------------------\n";
}
void FixedQueue::remove() {
    if (isEmpty()) {
        return; 
    }

    FixedNode* temp = head;   
    head = head->next;       

    if (head == nullptr) {
        tail = nullptr;
    }

    len--;

    temp->next = nullptr;
}

void FixedQueue::changestatus(int id, int newStatus) {
    FixedNode* cur = head;
    while (cur != nullptr) {
        if (cur->id == id) {
            cur->status = newStatus;
            return;
        }
        cur = cur->next;
    }
}



crow::json::wvalue FixedQueue::getAllFixedJSON() {
    vector<crow::json::wvalue> FixedList;

    FixedNode* temp = head;
    while (temp != nullptr) {
        crow::json::wvalue loan;
        loan["id"] = temp->id;
        loan["email"] = temp->email;
        loan["duration"] = temp->duration;
        loan["amount"] = temp->amount;
        loan["profit"] = temp->profit;
        loan["date"] = temp->date;
        loan["status"] = temp->status;
        FixedList.push_back(move(loan));
        temp = temp->next;
    }

    return crow::json::wvalue(FixedList);
}
vector<string> FixedQueue::getEmailAndMoney(int id) {
    FixedNode* cur = head;

    while (cur != nullptr) {
        if (cur->id == id) {
            return { cur->email, to_string((long long)cur->amount) };
        }
        cur = cur->next;
    }

    return {};
}

