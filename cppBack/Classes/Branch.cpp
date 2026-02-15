#include "Branch.hpp"
#include <string>
#include <vector>
using namespace std;

void BranchList::insert(int id, string name, string loc, string phone, string addr) {
    Branch* newBranch = new Branch{id, name, loc, phone, addr, nullptr, nullptr};

    if (!root) {
        root = newBranch;
        return;
    }

    Branch* current = root;
    Branch* parent = nullptr;

    while (true) {
        parent = current;
        if (id < current->id) {
            current = current->left;
            if (!current) {
                parent->left = newBranch;
                return;
            }
        } else {
            current = current->right;
            if (!current) {
                parent->right = newBranch;
                return;
            }
        }
    }
}


crow::json::wvalue BranchList::findById(int id) {
    crow::json::wvalue result;
    Branch* current = root;
    while(current){
        if(current->id ==id){
            result["id"] = current->id;
            result["name"] = current->branch_name;
            result["location_link"] = current->location_link;
            result["phone"] = current->phone;
            result["address"] = current->address;
            return result;
        }
        if(id < current->id){
            current = current->left;
        }
        else{
            current = current->right;
        }
    }
    return nullptr;
}

// bool BranchList::removeById(int id) {
//     Branch* current = root;
//     Branch* parent = nullptr;
    
//     while(current && current->id != id){
//         parent = current;
//         if(current->id == id){
//             break;
//         }        
//         if(id < current->id){
//             current = current->left;
//         }
//         else{
//             current = current->right;
//         }
//     }
//     if(!current){
//         return false; 
//     }
//     if(!current->left && !current->right){
//         if(current == root){
//             root = nullptr;
//         }
//         else if(parent->left == current){
//             parent->left = nullptr;
//         }
//         else{
//             parent->right = nullptr;
//         }
//         delete current;
//     }
//     else if(!current->left || !current->right){
//         Branch* child = current->left ? current->left : current->right;
//         if(current == root){
//             root = child;
//         }
//         else if(parent->left ){}
//     }
// }







bool BranchList::removeById(int id)
{
    Branch* current = root;
    Branch* parent = nullptr;

    
    while (current && current->id != id)
    {
        parent = current;
        if (id < current->id)
            current = current->left;
        else
            current = current->right;
    }

    if (!current)
        return false; 


    if (!current->left && !current->right)
    {
        if (current == root)
            root = nullptr;
        else if (parent->left == current)
            parent->left = nullptr;
        else
            parent->right = nullptr;

        delete current;
    }



    else if (!current->left || !current->right)
    {
        Branch* child = current->left ? current->left : current->right;

        if (current == root)
            root = child;
        else if (parent->left == current)
            parent->left = child;
        else
            parent->right = child;

        delete current;
    }

    else
    {
        Branch* successor = current->right;
        Branch* successorParent = current;

        while (successor->left)
        {
            successorParent = successor;
            successor = successor->left;
        }

       
        current->id = successor->id;
        current->branch_name = successor->branch_name; 

        if (successorParent->left == successor)
            successorParent->left = successor->right;
        else
            successorParent->right = successor->right;

        delete successor;
    }

    return true;
}











void BranchList::makeVectorList(Branch* root, vector<crow::json::wvalue>& branches){
    if(root == nullptr){
        return;
    }
    makeVectorList(root->left, branches);
    crow::json::wvalue result;
    result["id"] = root->id;
    result["name"] = root->branch_name;
    result["location_link"] = root->location_link;
    result["phone"] = root->phone;
    result["address"] = root->address;
    branches.push_back(result);
    makeVectorList(root->right, branches);
}

crow::json::wvalue BranchList::getAll() {
    vector<crow::json::wvalue> branches;
    makeVectorList(root, branches);
    return crow::json::wvalue(branches);
}
