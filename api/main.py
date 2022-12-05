from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Union
import pandas as pd

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def transform_to_int(x):
    x = x.split(',')
    return [int(i) for i in x]


@app.get('/FCFS')
def FCFS(pr, at, bt):
    pr = transform_to_int(pr)
    at = transform_to_int(at)
    bt = transform_to_int(bt)
    time = min(at)
    df = pd.DataFrame({'pr': pr, 'at': at, 'bt': bt})
    df = df.sort_values('at')
    ct = list()
    temp = time
    for i in range(len(df)):
        temp += df.iloc[i]['bt']
        ct.append(temp)
    df['ct'] = ct
    df['tat'] = df.apply(lambda x: x['ct'] - x['at'], axis=1)
    df['wt'] = df.apply(lambda x: x['tat'] - x['bt'], axis=1)
    df = df.sort_values('pr')
    return {'table': {'pr': df['pr'].tolist(), 'at': df['at'].tolist(), 'bt': df['bt'].tolist(), 'ct': df['ct'].tolist(), 'tat': df['tat'].tolist(), 'wt': df['wt'].tolist()}, 'wt_avg': df['wt'].mean(), 'tat_avg': df['tat'].mean()}


@app.get('/SJF')
def SJF(pr, at, bt):
    pr = transform_to_int(pr)
    at = transform_to_int(at)
    bt = transform_to_int(bt)
    time = min(at)
    df = pd.DataFrame({'pr': pr, 'at': at, 'bt': bt})
    df = df.sort_values('at')
    temp = time
    temp_df = df.copy()
    df['ct'] = 0
    while len(temp_df) > 0:
        copy_df = temp_df.copy()
        copy_df = copy_df[copy_df['at'] <= time]
        copy_df = copy_df.sort_values('bt')
        for i in copy_df.index:
            bt_temp = copy_df['bt'][i]
            temp += bt_temp
            time += bt_temp
            df['ct'][i] = temp
        temp_df = temp_df.drop(copy_df.index)
    df = df.sort_values('pr')
    df['tat'] = df.apply(lambda x: x['ct'] - x['at'], axis=1)
    df['wt'] = df.apply(lambda x: x['tat'] - x['bt'], axis=1)
    return {'table': {'pr': df['pr'].tolist(), 'at': df['at'].tolist(), 'bt': df['bt'].tolist(), 'ct': df['ct'].tolist(), 'tat': df['tat'].tolist(), 'wt': df['wt'].tolist()}, 'wt_avg': df['wt'].mean(), 'tat_avg': df['tat'].mean()}


@app.get('/SJF_P')
def SJF_p(pr, at, bt):
    pr = transform_to_int(pr)
    at = transform_to_int(at)
    bt = transform_to_int(bt)
    time = min(at)
    df = pd.DataFrame({'pr': pr, 'at': at, 'bt': bt})
    df = df.sort_values('at')
    temp = time
    temp_df = df.copy()
    df['ct'] = 0
    while time < max(at):
        copy_df = temp_df.copy()
        copy_df = copy_df[copy_df['at'] <= time]
        copy_df = copy_df.sort_values('bt')
        temp_df['bt'][int(copy_df.index[0])] -= 1
        time += 1
        temp += 1
        if temp_df['bt'][int(copy_df.index[0])] == 0:
            df['ct'][[int(copy_df.index[0])]] = temp
            temp_df = temp_df.drop([int(copy_df.index[0])])
    temp_df = temp_df.sort_values('bt')
    while len(temp_df) > 0:
        temp_index = int(temp_df.index[0])
        temp += temp_df['bt'][temp_index]
        df['ct'][temp_index] = temp
        temp_df = temp_df.drop(temp_index)
    df = df.sort_values('pr')
    df['tat'] = df.apply(lambda x: x['ct'] - x['at'], axis=1)
    df['wt'] = df.apply(lambda x: x['tat'] - x['bt'], axis=1)
    return {'table': {'pr': df['pr'].tolist(), 'at': df['at'].tolist(), 'bt': df['bt'].tolist(), 'ct': df['ct'].tolist(), 'tat': df['tat'].tolist(), 'wt': df['wt'].tolist()}, 'wt_avg': df['wt'].mean(), 'tat_avg': df['tat'].mean()}


@app.get('/LRF')
def LJF(pr, at, bt):
    pr = transform_to_int(pr)
    at = transform_to_int(at)
    bt = transform_to_int(bt)
    time = min(at)
    df = pd.DataFrame({'pr': pr, 'at': at, 'bt': bt})
    df = df.sort_values('at')
    temp = time
    temp_df = df.copy()
    df['ct'] = 0
    while len(temp_df) > 0:
        copy_df = temp_df.copy()
        copy_df = copy_df[copy_df['at'] <= time]
        copy_df = copy_df.sort_values('bt', ascending=False)
        for i in copy_df.index:
            bt_temp = copy_df['bt'][i]
            temp += bt_temp
            time += bt_temp
            df['ct'][i] = temp
            break
        temp_df = temp_df.drop([int(copy_df.index[0])])
    df = df.sort_values('pr')
    df['tat'] = df.apply(lambda x: x['ct'] - x['at'], axis=1)
    df['wt'] = df.apply(lambda x: x['tat'] - x['bt'], axis=1)
    return {'table': {'pr': df['pr'].tolist(), 'at': df['at'].tolist(), 'bt': df['bt'].tolist(), 'ct': df['ct'].tolist(), 'tat': df['tat'].tolist(), 'wt': df['wt'].tolist()}, 'wt_avg': df['wt'].mean(), 'tat_avg': df['tat'].mean()}


@app.get('/LRF_P')
def LJF_p(pr, at, bt):
    pr = transform_to_int(pr)
    at = transform_to_int(at)
    bt = transform_to_int(bt)
    time = min(at)
    df = pd.DataFrame({'pr': pr, 'at': at, 'bt': bt})
    df = df.sort_values('at')
    temp = time
    temp_df = df.copy()
    df['ct'] = 0
    while time < max(at):
        copy_df = temp_df.copy()
        copy_df = copy_df[copy_df['at'] <= time]
        copy_df = copy_df.sort_values('bt', ascending=False)
        temp_df['bt'][int(copy_df.index[0])] -= 1
        time += 1
        temp += 1
        if temp_df['bt'][int(copy_df.index[0])] == 0:
            df['ct'][[int(copy_df.index[0])]] = temp
            temp_df = temp_df.drop([int(copy_df.index[0])])
    temp_df = temp_df.sort_values('bt')
    while len(temp_df) > 0:
        copy_df = temp_df.copy()
        copy_df = copy_df[copy_df['at'] <= time]
        copy_df = copy_df.sort_values('bt', ascending=False)
        temp_df['bt'][int(copy_df.index[0])] -= 1
        time += 1
        temp += 1
        if temp_df['bt'][int(copy_df.index[0])] == 0:
            df['ct'][[int(copy_df.index[0])]] = temp
            temp_df = temp_df.drop([int(copy_df.index[0])])
    df = df.sort_values('pr')
    df['tat'] = df.apply(lambda x: x['ct'] - x['at'], axis=1)
    df['wt'] = df.apply(lambda x: x['tat'] - x['bt'], axis=1)
    return {'table': {'pr': df['pr'].tolist(), 'at': df['at'].tolist(), 'bt': df['bt'].tolist(), 'ct': df['ct'].tolist(), 'tat': df['tat'].tolist(), 'wt': df['wt'].tolist()}, 'wt_avg': df['wt'].mean(), 'tat_avg': df['tat'].mean()}


@app.get('/Priority')
def Priority(pr, at, bt, priority):
    pr = transform_to_int(pr)
    at = transform_to_int(at)
    bt = transform_to_int(bt)
    priority = transform_to_int(priority)
    time = min(at)
    df = pd.DataFrame({'pr': pr, 'at': at, 'bt': bt, 'priority': priority})
    df = df.sort_values('at')
    temp = time
    temp_df = df.copy()
    df['ct'] = 0
    while len(temp_df) > 0:
        copy_df = temp_df.copy()
        copy_df = copy_df[copy_df['at'] <= time]
        copy_df = copy_df.sort_values('priority')
        for i in copy_df.index:
            bt_temp = copy_df['bt'][i]
            temp += bt_temp
            time += bt_temp
            df['ct'][i] = temp
        temp_df = temp_df.drop(copy_df.index)
    df = df.sort_values('pr')
    df['tat'] = df.apply(lambda x: x['ct'] - x['at'], axis=1)
    df['wt'] = df.apply(lambda x: x['tat'] - x['bt'], axis=1)
    return {'table': {'pr': df['pr'].tolist(), 'at': df['at'].tolist(), 'bt': df['bt'].tolist(), 'ct': df['ct'].tolist(), 'tat': df['tat'].tolist(), 'wt': df['wt'].tolist(), 'priority': df['priority'].tolist()}, 'wt_avg': df['wt'].mean(), 'tat_avg': df['tat'].mean()}


@app.get('/Priority_P')
def Priority_p(pr, at, bt, priority):
    pr = transform_to_int(pr)
    at = transform_to_int(at)
    bt = transform_to_int(bt)
    priority = transform_to_int(priority)
    time = min(at)
    df = pd.DataFrame({'pr': pr, 'at': at, 'bt': bt, 'priority': priority})
    df = df.sort_values('at')
    temp = time
    temp_df = df.copy()
    df['ct'] = 0
    while time < max(at):
        copy_df = temp_df.copy()
        copy_df = copy_df[copy_df['at'] <= time]
        copy_df = copy_df.sort_values('priority')
        temp_df['bt'][int(copy_df.index[0])] -= 1
        time += 1
        temp += 1
        if temp_df['bt'][int(copy_df.index[0])] == 0:
            df['ct'][[int(copy_df.index[0])]] = temp
            temp_df = temp_df.drop([int(copy_df.index[0])])
    temp_df = temp_df.sort_values('priority')
    while len(temp_df) > 0:
        temp_index = int(temp_df.index[0])
        temp += temp_df['bt'][temp_index]
        df['ct'][temp_index] = temp
        temp_df = temp_df.drop(temp_index)
    df = df.sort_values('pr')
    df['tat'] = df.apply(lambda x: x['ct'] - x['at'], axis=1)
    df['wt'] = df.apply(lambda x: x['tat'] - x['bt'], axis=1)
    return {'table': {'pr': df['pr'].tolist(), 'at': df['at'].tolist(), 'bt': df['bt'].tolist(), 'ct': df['ct'].tolist(), 'tat': df['tat'].tolist(), 'wt': df['wt'].tolist(), 'priority': df['priority'].tolist()}, 'wt_avg': df['wt'].mean(), 'tat_avg': df['tat'].mean()}


@app.get('/RoundRobin')
def RoundRobin(pr, bt, time_quanta):
    pr = transform_to_int(pr)
    bt = transform_to_int(bt)
    time_quanta = int(time_quanta)
    df = pd.DataFrame({'pr': pr, 'bt': bt})
    df = df.sort_values('pr')
    temp = 0
    df['ct'] = 0
    copy_df = df.copy()
    while len(copy_df) > 0:
        for i in copy_df.index:
            if copy_df['bt'][i] > time_quanta:
                copy_df['bt'][i] -= time_quanta
                temp += time_quanta
            else:
                temp += copy_df['bt'][i]
                df['ct'][i] = temp
                copy_df = copy_df.drop([i])
    df['tat'] = df.apply(lambda x: x['ct'], axis=1)
    df['wt'] = df.apply(lambda x: x['tat'] - x['bt'], axis=1)
    return {'table': {'pr': df['pr'].tolist(), 'bt': df['bt'].tolist(), 'ct': df['ct'].tolist(), 'tat': df['tat'].tolist(), 'wt': df['wt'].tolist()}, 'wt_avg': df['wt'].mean(), 'tat_avg': df['tat'].mean()}
