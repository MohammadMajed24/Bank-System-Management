#include "TransactionDLL.hpp"
#include <iostream>
#include "../globals.hpp"
#include <vector>
using namespace std;
using namespace crow;

void TransactionDLL::insertTransaction(int id, string senderAccountNumber,string receiverAccountNumber,long long int amount,string date)
{
    TransactionNode *newNode = new TransactionNode();
    newNode->id = id;
    newNode->senderAccountNumber = senderAccountNumber;
    newNode->receiverAccountNumber = receiverAccountNumber;
    newNode->amount = amount;
    newNode->date = date;

    if (head == nullptr)
    {
        head = tail = newNode;
        size++;
        return;
    }
    tail->next = newNode;
    tail = newNode;
    size++;
}

crow::json::wvalue TransactionDLL::getUserTransactions(string accountNumber)
{
    TransactionNode* cur = head;
    vector<json::wvalue> userTransactions;
    while (cur != nullptr)
    {
        if (cur->senderAccountNumber == accountNumber || cur->receiverAccountNumber == accountNumber){
            json::wvalue transaction;
            transaction["id"] = cur->id;
            transaction["senderAccountNumber"] = cur->senderAccountNumber;
            transaction["receiverAccountNumber"] = cur->receiverAccountNumber;
            transaction["amount"] = cur->amount;
            transaction["date"] = cur->date;
            userTransactions.push_back(transaction);
        }
        cur = cur->next;
    }
    return crow::json::wvalue(userTransactions);
}

json::wvalue TransactionDLL::getAllTransactions()
{
    json::wvalue transactions;
    TransactionNode* cur = head;
    vector<json::wvalue> allTransactions;
    while (cur != nullptr)
    {
            json::wvalue transaction;
            transaction["id"] = cur->id;
            transaction["senderAccountNumber"] = cur->senderAccountNumber;
            transaction["receiverAccountNumber"] = cur->receiverAccountNumber;
            transaction["amount"] = cur->amount;
            transaction["date"] = cur->date;
            allTransactions.push_back(transaction);
        cur = cur->next;
    }
    return crow::json::wvalue(allTransactions);
}

json::wvalue TransactionDLL::getTransactionById(int id)//bimary search 
{
    int first=0,last=size-1;
    bool found=false;
    while(first<=last && !found){
        int mid=(first+last)/2;
        TransactionNode* cur=head;
        for(int i=0;i<mid;i++){
            cur=cur->next;
        }
        if(cur->id==id){
            json::wvalue transaction;
            transaction["id"] = cur->id;
            transaction["senderAccountNumber"] = cur->senderAccountNumber;
            transaction["receiverAccountNumber"] = cur->receiverAccountNumber;
            transaction["amount"] = cur->amount;
            transaction["date"] = cur->date;
            return transaction;
        }
        else if(cur->id<id){
            first=mid+1;
        }
        else{
            last=mid-1;
        }
    }
    json::wvalue notFound;
    notFound["message"]="Transaction not found";
    return notFound;

}

