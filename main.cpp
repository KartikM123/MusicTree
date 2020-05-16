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
using namespace std;

//Team member traits
struct mem {
	int id;
	double capacity;
	double happy_A;
	double happy_B;
	int pick_state;
};

//Team traits
struct team {
	//vector<mem> teamMem;
	double score;
	bool isDiverse;
	map <int, int> discovered;
	int teamsize;
	team(): score(120.f),
			isDiverse(true),
			teamsize(0){}
};

struct ans {
	//vector<mem> idealTeam;
	int nextPick;
	double advantage;
	bool operator<(const ans& r) const
    {
        return advantage < r.advantage;
    }
};

int NUM_PARTICIPANTS;
string ALGORITHM;

team teamA;
team teamB;
vector <mem> freeMems; //no on a team yet

int counts = 0;
int prunes = 0;

int totalCases = 10;
int numBasicCases = 6;
string basicCases[] = {"bBest.txt", "bIDtiebreak.txt","bHappy.txt","bHappyAB.txt","bDiversity.txt","bDiversityAB.txt"};
string testCases[] = {"input0.txt","input2.txt","input3.txt","input4.txt","input5.txt","input6.txt","input7.txt","input8.txt","input9.txt","input1.txt"};
int bOutputs[] = {88709, 88708, 88708, 88708, 88709, 88709};
int outputs[] = {58502, 14902, 26604, 58502, 58502, 14902, 30905, 94703, 39203,58502};
void printMem(mem m){
	cout<<"ID:"<<m.id<<" Capac:"<<m.capacity<<" Picked:"<< m.pick_state << "  Happy " << m.happy_A<<" || "<<m.happy_B<<endl;
}

bool compareMems(const mem &a, const mem &b)
{
    //return (a.capacity*a.happy_A-a.capacity-a.happy_B) > (b.capacity*b.happy_A-b.capacity-b.happy_B);
	return (a.id < b.id);
	//return (a.capacity*a.happy_A > b.capacity*b.happy_A);

}
void printMems(vector<mem> members)
{
	for(int i = 0; i < members.size(); i++)
	{
		printMem(members.at(i));
	}
}
void printTeamA()
{
	cout<<"+-----------------------+"<<endl;
	cout<<"TEAM A"<<endl;
	//printMems(teamA.teamsize);
	cout<<"Score: "<<teamA.score<< " | Diverse: "<< teamA.isDiverse<<endl;
	cout<<"+-----------------------+"<<endl;
}

void printTeamB()
{
	cout<<"+-----------------------+"<<endl;
	cout<<"TEAM B"<<endl;
	//printMems(teamB.teamsize);
	cout<<"Score: "<<teamB.score<< " | Diverse: "<< teamB.isDiverse<<endl;
	cout<<"+-----------------------+"<<endl;
}
void printFreeAgents(){
	cout<<"-----------------------"<<endl;
	cout<<"FREE AGENTS"<<endl;
	printMems(freeMems);
	cout<<"-----------------------"<<endl;
}

void printAll(){
	return;
	printTeamA();
	printTeamB();
	printFreeAgents();
}

float calcA (float score1, float score2){
	return score1-score2;
}
//Calculate potential Score based on team t and mem m
//return (score, isDiverse)
pair<double,bool> potScore (team t, mem m, double happy)
{
	bool diverse = t.isDiverse;
	double newScore = t.score;

	int tag = m.id%10;
	if(diverse)
	{
		if (t.discovered[tag]>=1){
			//duplicate found
			diverse = false;
			newScore -= 120.f;
		}
	}
	newScore += m.capacity * happy;
	

	return make_pair(newScore, diverse);

}

void addToTeam(team & t, mem m, double happy)
{	
	pair<double,bool> newS  = potScore(t, m, happy);
	double score = newS.first;
	bool isDiverse = newS.second;
	int tag = m.id%10;
	t.discovered[tag]++;
	t.score = score;
	t.isDiverse = isDiverse;
	t.teamsize++;
	//t.teamMem.push_back(m);
}

void removeFromTeam(team & t, mem m, double happy) {
	t.discovered[m.id%10]--;
	t.score-=(m.capacity*happy);
	t.teamsize--;
	if (!t.isDiverse){
		t.isDiverse = true;
		for(int i = 0; i < 10; i ++){
			if (t.discovered[i]>1){
				t.isDiverse = false;
			}
		}
		if (t.isDiverse){
			t.score+=120.f;
		}
	}
}

void readFile(string fileName){
	//assume empty teams start with diversity score
	ifstream ifile (fileName);
	ifile >> NUM_PARTICIPANTS;
	ifile >> ALGORITHM;
	for(int i = 0; i < 10; i ++){
		teamA.discovered[i] = 0;
		teamB.discovered[i] = 0;
	}
	for(int i =0; i < NUM_PARTICIPANTS; i++)
	{
		string partInfo;
		char junk;
		ifile>>partInfo;
		stringstream ss(partInfo);
		
		mem newM;
		ss>>newM.id;
		ss>>junk;
		ss>>newM.capacity;
		ss>>junk;
		ss>>newM.happy_A;		
		ss>>junk;
		ss>>newM.happy_B;
		ss>>junk;
		ss>>newM.pick_state;

		if (newM.pick_state == 2)
		{
			addToTeam(teamB, newM, newM.happy_B);
		} else if (newM.pick_state == 1)
		{
			addToTeam(teamA, newM, newM.happy_A);
		} else
		{
			freeMems.push_back(newM);
		}
		
	}
		//teamA.teamsize = teamA.teamMem.size();
		//teamB.teamsize = teamB.teamMem.size();
	cout<<NUM_PARTICIPANTS<<endl;
	cout<<ALGORITHM<<endl;
	cout<<teamB.teamsize<<"TEAMSIZE"<<endl;
	cout<<teamB.score<<endl;

	sort(freeMems.begin(), freeMems.end(), compareMems);

	//teamA.discovered = {{0,0},{1,0}, {2,0}, {3,0}, {4,0},{5,0}, {6,0}, {7,0}, {8,0} ,{9,0} };
	//teamB.discovered = {{0,0},{1,0}, {2,0}, {3,0}, {4,0},{5,0}, {6,0}, {7,0}, {8,0} ,{9,0} };

	//cout<<teamA.discovered[2]<<" HI"<<endl;
	printAll();
}

/*
PSEUDOCODE
recurseCall(teamA, teamB, freeAgents, turn, alpha = int_min, beta = int_max) {
	if (both teams full){
		return teamA.score - teamB.score;
	}

	if (turn = teamB){
		minCandidate
		for (c in freeAgents){
			//(c is a candidate to be added to the team)
			minCandidate = min(minCandidate, recurse(teamA,teamB[with c], freeAgents[without c], minCandidate, turn=teamA, alpha, beta))

			beta = min(beta,minCandidate)
			if (beta <= alpha){
				return minCandidate;
			}
		}
		return minCandidate;
	} else {
		maxCandidate
		for (c in freeAgents){
			//(c is a candidate to be added to the team)
			maxCandidate = max(maxCandidate, recurse(teamA [with c],teamB, freeAgents[without c], minCandidate, turn=teamB, alpha, beta))

			alpha = max(alpha,maxCandidate)
			if (beta <= alpha){
				return maxCandidate;
			}
		}
		return maxCandidate
	}
}
*/

ans minimax(bool minTurn){
	ans a;
		
	if (freeMems.empty() || (teamA.teamsize == 5 && teamB.teamsize ==5))
	{

		a.advantage = teamA.score-teamB.score;
		return a;
	}
		counts++;
	if (teamA.teamsize > 5){
		minTurn = true;
	}
	if (teamB.teamsize > 5){
		minTurn = false;
	}
	int s = freeMems.size();
	if (minTurn){
		//b is going to be minimizing!
		a.advantage = 100000.f; // some minValue
		int bestId = 100000.f;
		for (int i = 0 ; i < s; i++)
		{
			if (freeMems.at(i).pick_state == 0)
			{

				mem m = freeMems.at(i);

				//freeMems.erase(freeMems.begin());
				freeMems.at(i).pick_state = 2;
				//team tempB = tB;
				addToTeam(teamB,m, m.happy_B);
				ans pickCase = minimax(false);

				removeFromTeam(teamB,m, m.happy_B);
				//freeMems.push_back(m);
				freeMems.at(i).pick_state = 0;

				if (a.advantage > pickCase.advantage){
					a = pickCase;
					bestId = m.id;
				} 
				if (a.advantage == pickCase.advantage){
					if (bestId > m.id){
						bestId = m.id;
						a = pickCase;
					}
				}
			}
		}
		return a;
	} else 
	{
		//a is going to be maximizing!
		a.advantage = -100000.f; 
		mem bestMemID;
		for (int i = 0 ; i < s; i++)
		{

			if (freeMems.at(i).pick_state == 0)
			{
				mem m = freeMems.at(i);
				addToTeam(teamA,m, m.happy_A);
				//freeMems.erase(freeMems.begin());
				freeMems.at(i).pick_state = 1;
				ans pickCase = minimax(true);
				//freeMems.push_back(m);
				removeFromTeam(teamA,m, m.happy_A);
				freeMems.at(i).pick_state = 0;
				if (a.advantage == pickCase.advantage) {
					if (bestMemID.id > m.id){
						bestMemID = m;
						a = pickCase;
					}
				}
				if (a.advantage < pickCase.advantage) {
					bestMemID = m;
					a = pickCase;
				}
				
			}
			
		}
		a.nextPick = bestMemID.id;
		return a;
	}
}
void itTest(){
	int s = freeMems.size();
	int c = 0; 
			for (int i = 0 ; i <= s; i++)
		{
			if (freeMems.at(0).pick_state == 0)
			{
				mem m = freeMems.at(0);
				cout<<m.id<<endl;
				freeMems.erase(freeMems.begin());
				freeMems.push_back(m);
				c++;
			}
		}
		cout<<c<<" "<<s<<endl;
}

ans abPruning(bool minTurn, ans alpha, ans beta){
	ans a;
		
	if (freeMems.empty() || (teamA.teamsize == 5 && teamB.teamsize ==5))
	{
		a.advantage = teamA.score-teamB.score;

		
		return a;
	}
		counts++;
	if (teamA.teamsize > 5){
		minTurn = true;
	}
	if (teamB.teamsize > 5){
		minTurn = false;
	}
	int s = freeMems.size();
	if (minTurn){
		//b is going to be minimizing!
		a.advantage = 100000.f; // some minValue
		int bestId = 100000.f;
		for (int i = 0 ; i < s; i++)
		{
			if (freeMems.at(i).pick_state == 0)
			{

				mem m = freeMems.at(i);

				//freeMems.erase(freeMems.begin());
				
				freeMems.at(i).pick_state = 2;
				//team tempB = tB;
				addToTeam(teamB,m, m.happy_B);
				ans pickCase = abPruning(false, alpha, beta);
				removeFromTeam(teamB,m, m.happy_B);
				if (a.advantage > pickCase.advantage){
					a = pickCase;
					bestId = m.id;
				} 
				if (a.advantage == pickCase.advantage){
					if (bestId > m.id){
						bestId = m.id;
						a = pickCase;
					}
				}
				//freeMems.push_back(m);			 
				freeMems.at(i).pick_state = 0;
				if (a.advantage < beta.advantage){
					beta = a;
				}
				if (a.advantage <= alpha.advantage)
				{	
					prunes++;
					return beta;
				}
			}


		}
		return a;
	} else 
	{
		//a is going to be maximizing!
		a.advantage = -100000.f; 
		mem bestMemID;
		for (int i = 0 ; i < s; i++)
		{

			if (freeMems.at(i).pick_state == 0)
			{
				mem m = freeMems.at(i);
				addToTeam(teamA,m, m.happy_A);
				//freeMems.erase(freeMems.begin());
				freeMems.at(i).pick_state = 1;
				ans pickCase = abPruning(true, alpha, beta);
				removeFromTeam(teamA, m, m.happy_A);
				if (a.advantage == pickCase.advantage) {
					if (bestMemID.id > m.id){
						bestMemID = m;
						a = pickCase;
					}
				}
				if (a.advantage < pickCase.advantage) {
					bestMemID = m;
					a = pickCase;
				}
				freeMems.at(i).pick_state = 0;

		/*if (s == 59){
			cout<<"HERE"<<endl;
			cout<<m.id<<endl;	
		}*/
			//alpha = max(alpha, a.alpha);
			if (a.advantage > alpha.advantage){
					alpha = a;
			}
			if (a.advantage >= beta.advantage)
			{
				prunes++;
				alpha.nextPick = bestMemID.id;
				a = alpha;
				return a;
			}
			}
			
		}
		a.nextPick = bestMemID.id;
		return a;
	}
}

void normalTest(){
	for(int i = 0; i <totalCases; i++)
	{
		counts = 0; 
		prunes=0;
		team tA;
		team tB;
		teamA = tA;
		teamB = tB;
		freeMems.clear();	
		ans alpha;
		ans beta;
		alpha.advantage = -1000000000.f;
		beta.advantage = 1000000000.f;	
		readFile("Test/"+testCases[i]);
		ans res;
		bool check = false;
		if (!ALGORITHM.compare("ab")){
			cout<<"Initializing AB Pruning"<<endl;
			res = abPruning(false, alpha, beta);
			check = true;
		} else if (!ALGORITHM.compare("minimax"))
		{
			cout<<"Initializing Minimax"<<endl;
			res = minimax(false);
			check = true;
		}

		if (check) {
			if (res.nextPick == outputs[i])
			{
				cout<<"Success on test case "<< testCases[i]<< "countss: "<< counts << " prunes " << prunes<<endl;
			}else{
				cout<<"Fail on test case "<< testCases[i]<< " || Expected: "<< outputs[i]<< " Received: "<<res.nextPick<< " A: "<<res.advantage<<" countss: "<< counts << endl;
			}
		}
	}
}

int main(int argc, char* argv[]){
	if (argc == 2){
		string s = argv[1];
		if (!s.compare("base")){
			//testScript();
			return 0;
		}
		if (!s.compare("norm")){
			normalTest();
			return 0;
		}
		readFile(argv[1]);
	} else {
		readFile("input.txt");
	}
	ans res;
	//printMems(freeMems);
	counts = 0;
		cout<<freeMems.size()<<endl;

	if (!ALGORITHM.compare("ab")){
		cout<<"Initializing AB Pruning"<<endl;
		ans alpha;
		ans beta;
		alpha.advantage = -1000000000.f;
		beta.advantage = 1000000000.f;
		res = abPruning(false, alpha, beta);
	} else if (!ALGORITHM.compare("minimax"))
	{
		cout<<"Initializing Minimax"<<endl;
		res = minimax(false);
	}
	//cout<<"Final A value "<<res.advantage<<endl;
	//cout<<"Final next pick value "<<res.nextPick<<endl;
	//cout<<"Final counts "<<counts<<endl;
	
	    string output_file = "output.txt";
    ofstream ofile (output_file);
    ofile << res.nextPick;

	return 0;
}
