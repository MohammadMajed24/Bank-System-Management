#pragma once
#include <string>
#include <iostream>
#include <crow.h>
using namespace std;


class TransactionDLL{
    struct TransactionNode{
        int id;
        string senderAccountNumber;
        string receiverAccountNumber;
        long long int amount;
        string date;
        TransactionNode *next=nullptr;
    };
    TransactionNode *head;
    TransactionNode *tail;
    int size;
    public:
    TransactionDLL(){
        head=nullptr;
        tail=nullptr;
        size=0;
    }
    void insertTransaction(int id, string senderAccountNumber,string receiverAccountNumber,long long amount,string date);
    crow::json::wvalue getUserTransactions(string accountNumber);
    crow::json::wvalue getAllTransactions();
    crow::json::wvalue getTransactionById(int id);
};
