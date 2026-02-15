#include "StackPassword.hpp"
#include "../globals.hpp"
void StackPassword::pushRequest(const string password, string email) {
    Node* newNode = new Node();
    newNode->password = password;
    newNode->email = email;
    newNode->next = top;
    top = newNode;
    
}

bool StackPassword::isEmpty() {
    return top == nullptr;
}
void StackPassword::popRequest() {
    if (isEmpty()) {
        return;
    }
    Node* temp = top;
    top = top->next;
    delete temp;
}

crow::json::wvalue StackPassword::getAllData() {
    vector<crow::json::wvalue> dataList;
    Node* current = top;

    while (current != nullptr) {
        crow::json::wvalue data;
        data["email"] = current->email;
        data["password"] = current->password;
        dataList.push_back(data);
        current = current->next;
    }
    return crow::json::wvalue(dataList);
}
        
        
        