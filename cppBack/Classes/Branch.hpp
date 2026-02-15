#pragma once
#include <string>
#include <iostream>
#include <crow.h>
using namespace std;



class BranchList {
    struct Branch{
    int id; // from DB
    string branch_name;
    string location_link;
    string phone;
    string address;
    Branch* right=nullptr;
    Branch* left=nullptr;
    };
private:
    Branch* root;

public:
    BranchList(){
        root = nullptr;
    };
    
   
    void insert(int id, string name, string loc, string phone, string addr);
    crow::json::wvalue findById(int id);
    bool removeById(int id);
    void makeVectorList(Branch* root, vector<crow::json::wvalue>& branches);
    crow::json::wvalue getAll(); 
};




