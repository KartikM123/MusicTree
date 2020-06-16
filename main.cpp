#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <sstream>
#include <cstdlib>
#include<string>
#include<queue>
#include <unordered_set>
#include <map>
#include <tuple>
#include <json/value.h>
using namespace std;

struct Question{
	string q;
	bool isInverted;
}

struct QuestionSet{
	string name;
	string positive_class;
	string negative_class;
	vector<Question> questions;
};

vector<QuestionSet> survey;

void readQuestions(){

}

int askQuestion(string q){
	int ans = 0;
	while (ans < 1 && ans > 5){
		cout<<q<<endl;
		cin>>ans;

		if (ans < 1 && ans > 5){
			cout<<"Invalid Response. Please input a number between 1 and 5"<<endl;
		}
	}
	return ans;
}


int main(int argc, char* argv[]){
	readQuestions();
	return 0;
}
