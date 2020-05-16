import sys
import io
import os
import argparse
import nbformat
import json

QuestionSet = {}
question_file = "Question_Data/questions.json"
mapping_file = "Question_Data/AlbumMapping.json"
ratings = {}
classifications = {}
threshold = 2.5

def initRatings():
    global ratings
    for p in QuestionSet:
        ratings[p] = 0.0
def readQuestion(q):
    ans = 0
    while (ans < 1 or ans > 5):
        print(q)
        try:
            ans = int(raw_input('Enter a number between 1 and 5: '))
        except ValueError:
            print("HERE")
        if (ans < 1 or ans > 5):
            print("Invalid input, please try again")
    return ans
def askQuestions():
    global QuestionSet
    global ratings
    for field in QuestionSet:
        c = 0
        print("")
        print("---------------------")
        print(str(field) + " QUESTIONS")
        for q in QuestionSet[field]["Questions"]:
            c = c + 1
            print("")
            ans = readQuestion(q[0])
            if (q[1]):
                print ("Here")
                ans = 6 - ans
            print(ratings[field], ans)
            ratings[field] = (ratings[field]*(c-1) + ans) / c
            print(ratings[field])
def thresholdName(field, rating):
    if (rating > 2.5):
        return str(QuestionSet[field]["Positive"])
    else: 
        return str(QuestionSet[field]["Negative"])
def readRatings():
    global classifications
    print("Ratings")
    for p in ratings:
        print(p, ratings[p], thresholdName(p, ratings[p]))
        classifications[p] = thresholdName(p, ratings[p])
def recAlbum():
    mapping = {}
    print("------------")
    print("Your Ideal Album is...")
    with open(mapping_file) as f:
        mapping = json.load(f)
    for p in mapping:
        compareString = mapping[p]["traits"]
        fit = True
        for c in classifications:
            if not (classifications[c] in compareString):
                fit = False
        if (fit):
            print(p)
            return
    print("No Match!")
def printIntro():
    print("------------------------")
    print("Welcome to My Music Tree")
    print("We will ask 4 categories of questions to see what fits you best")
    print("")
    raw_input("Press enter to continue...")
    print("------------------------")

def main():
    global QuestionSet
    global ratings
    printIntro()
    with open (question_file) as f:
        QuestionSet = json.load(f)
    initRatings()
    askQuestions()
    readRatings()
    recAlbum()
    return 0

if __name__ == '__main__':
    main()