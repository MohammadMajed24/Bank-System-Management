#pragma once

#include "Classes/SDLL.hpp"
#include "Classes/QActivateAccounts.hpp"
#include "Classes/TransactionDLL.hpp"
#include "Classes/StackPassword.hpp"
#include <mysql.h>

#include "Classes/LSLL.hpp"
#include "Classes/LQue.hpp"
#include "Classes/notfisll.hpp"


#include "Classes/Branch.hpp"


#include "Classes/FixedSSl.hpp"
#include "Classes/FQue.hpp"
using namespace std;

extern SLL userList; 
extern MYSQL* conn;
extern QActivateAccounts activateAccounts;
extern TransactionDLL transactionList;
extern StackPassword stackPassword;

extern notfsll NotfiSLL;
extern LoanSLL LoanSSL;
extern LoanQueue LoanQ;
string currentDate();
string dataForYossef();

extern FixedSLL FixedSSL;
extern FixedQueue FixedQ;



extern BranchList branchList;