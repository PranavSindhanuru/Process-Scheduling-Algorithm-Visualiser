import { useState, useEffect } from 'react';
import { TextField } from "@mui/material";
import Axios from 'axios';
import './App.css';

function App() {
  const [row, setRow] = useState([])

  const [addPr, setAddPr] = useState(false);
  const [editPr, setEditPr] = useState(false);
  const [evalPage, setEvalPage] = useState(false);
  const [dropDown, setDropDown] = useState(false);

  const [prNo, setPrNo] = useState(1);
  const [at, setAt] = useState();
  const [bt, setBt] = useState();
  const [priority, setPriority] = useState();
  const [timeQuanta, setTimeQuanta] = useState(20);

  const [EprNo, setEPrNo] = useState();
  const [Eat, setEAt] = useState();
  const [Ebt, setEBt] = useState();
  const [Epriority, setEPriority] = useState();

  const [data, setData] = useState();

  const getData = (algo) => {
    var temp_pr = "";
    var temp_at = "";
    var temp_bt = "";
    var temp_priority = "";
    row.map((item) => {
      temp_pr += item.pr + "%2C"
      temp_at += item.at + "%2C"
      temp_bt += item.bt + "%2C"
      temp_priority += item.priority + "%2C"
    })
    temp_pr = temp_pr.substring(0, temp_pr.length - 3);
    temp_at = temp_at.substring(0, temp_at.length - 3);
    temp_bt = temp_bt.substring(0, temp_bt.length - 3);
    temp_priority = temp_priority.substring(0, temp_priority.length - 3);
    if (algo == 'FCFS') {
      Axios.get(`http://127.0.0.1:8000/FCFS?pr=${temp_pr}&at=${temp_at}&bt=${temp_bt}`).then((response) => {
        setData(response.data)
      })
    } else if (algo == 'SJF') {
      Axios.get(`http://127.0.0.1:8000/SJF?pr=${temp_pr}&at=${temp_at}&bt=${temp_bt}`).then((response) => {
        setData(response.data)
      })
    } else if (algo == 'SJF_P') {
      Axios.get(`http://127.0.0.1:8000/SJF_P?pr=${temp_pr}&at=${temp_at}&bt=${temp_bt}`).then((response) => {
        setData(response.data)
      })
    } else if (algo == 'LRF') {
      Axios.get(`http://127.0.0.1:8000/LRF?pr=${temp_pr}&at=${temp_at}&bt=${temp_bt}`).then((response) => {
        setData(response.data)
      })
    } else if (algo == 'LRF_P') {
      Axios.get(`http://127.0.0.1:8000/LRF_P?pr=${temp_pr}&at=${temp_at}&bt=${temp_bt}`).then((response) => {
        setData(response.data)
      })
    } else if (algo == 'Priority') {
      Axios.get(`http://127.0.0.1:8000/Priority?pr=${temp_pr}&at=${temp_at}&bt=${temp_bt}&priority=${temp_priority}`).then((response) => {
        setData(response.data)
      })
    } else if (algo == 'Priority_P') {
      Axios.get(`http://127.0.0.1:8000/Priority_P?pr=${temp_pr}&at=${temp_at}&bt=${temp_bt}&priority=${temp_priority}`).then((response) => {
        setData(response.data)
      })
    } else if (algo == 'RoundRobin') {
      Axios.get(`http://127.0.0.1:8000/RoundRobin?pr=${temp_pr}&bt=${temp_bt}&time_quanta=${timeQuanta}`).then((response) => {
        setData(response.data)
      })
    }
  }

  function onAddPr() {
    if (at && bt && priority) {
      setPrNo(prNo + 1);
      var temp = { pr: prNo, at: at, bt: bt, priority: priority }
      setRow(oldArray => [...oldArray, temp]);
      setAt();
      setBt();
      setPriority();
      setAddPr(false);
    }
    else {
      setAt();
      setBt();
      setPriority();
      setAddPr(false);
    }
  }

  const onClickRemoveRow = (process) => {
    setRow(row.filter(item => item.pr != process))
  }

  const onClickEditRow = (item) => {
    setEditPr(true)
    setEPrNo(item.pr)
    setEAt(item.at)
    setEBt(item.bt)
    setEPriority(item.priority)
  }

  const onClickEval = () => {
    if (dropDown) {
      setDropDown(false);
    } else {
      setDropDown(true);
    }
  }

  const onClickEditSave = () => {
    setEditPr(false)
    var temp = { pr: EprNo, at: Eat, bt: Ebt, priority: Epriority }
    const rowLtemp = row.filter(item => item.pr < temp.pr)
    const rowRtemp = row.filter(item => item.pr > temp.pr)
    setRow([...rowLtemp, temp, ...rowRtemp]);
  }

  useEffect(() => { }, [row])

  useEffect(() => {
    let timeout
    if (dropDown) {
      timeout = setTimeout(() => setDropDown(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [dropDown]);

  return (
    <div className="App bg-[#FAFAFA]">
      <div className="h-16 bg-[#536B78] font-['Poppins'] text-[#F2F2F2] text-3xl flex justify-center items-center">Process Scheduling Algorithm Visualiser</div>

      {/* div content */}
      {!addPr && !editPr && !evalPage &&
        <div className="z-0 mt-[40px] mx-[40px] h-[450px] bg-[#EFF6FB] shadow-lg rounded-lg">
          <div className="h-[35px] bg-[#637081] font-['Poppins'] text-[#F2F2F2] rounded-t-lg grid-cols-3 grid gap-4 flex justify-center items-center">
            <div className="">Process</div>
            <div className="ml-20 grid-cols-2 grid w-[250px]">
              <div className="">Time Quantum</div>
              <div className="mx-5 rounded-lg bg-[#EFF6FB] text-[#000000]">
                <TextField
                  type='number'
                  value={timeQuanta}
                  onChange={(e) => {
                    setTimeQuanta(e.target.value);
                  }}
                  InputProps={{ sx: { height: 25 } }}
                  size="small"
                />
              </div>
            </div>
            <div className="cursor-pointer mx-5 w-2/3 flex rounded-lg justify-center items-center bg-[#EFF6FB] text-[#000000]" onClick={() => { setAddPr(true) }}>Add Process <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-5 w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            </div>
          </div>

          <div className="h-[35px] bg-[#ACCBE1] font-['Poppins'] text-[#000000] grid-cols-5 grid gap-4 flex justify-center items-center">
            <div className="">Process ID</div>
            <div className="">Arrival Time</div>
            <div className="">Burst Time</div>
            <div className="">Priority</div>
            <div className=""></div>
          </div>

          {/* processess */}
          <div className="h-[375px] overflow-y-auto divide-y-2">
            {row.map((row_elements) => (
              <div className="h-[40px] font-['Poppins'] text-[#000000] grid-cols-5 grid gap-4 flex justify-center items-center">
                <div className="">{row_elements.pr}</div>
                <div className="">{row_elements.at}</div>
                <div className="">{row_elements.bt}</div>
                <div className="">{row_elements.priority}</div>
                <div className="grid-cols-2 grid">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="cursor-pointer w-5 h-5" onClick={() => onClickEditRow(row_elements)}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="cursor-pointer w-5 h-5" onClick={() => onClickRemoveRow(row_elements.pr)}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="cursor-pointer m-5 h-[30px] flex justify-center items-center" onClick={onClickEval}>
            <div className="w-[300px] h-[30px] text-lg flex bg-[#ACCBE1] rounded-lg shadow-lg justify-center items-center">Evaluate
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-5 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
              </svg>
            </div>
          </div>
          {dropDown &&
            <div class="absolute inset-0 flex justify-center items-center z-10 h-[350px] w-[200px] rounded-lg shadow-lg bg-[#FFFFFF] ml-[585px] mt-[220px]">
              <div className="divide-y-2 w-[200px]">
                <div className="p-2 cursor-pointer hover:bg-[#F2F2F2]" onClick={() => { getData('FCFS'); setEvalPage(true) }}>FCFS</div>
                <div className="p-2 cursor-pointer hover:bg-[#F2F2F2]" onClick={() => { getData('SJF'); setEvalPage(true) }} >SJF</div>
                <div className="p-2 cursor-pointer hover:bg-[#F2F2F2]" onClick={() => { getData('SJF_P'); setEvalPage(true) }} >SJF - Preemptive</div>
                <div className="p-2 cursor-pointer hover:bg-[#F2F2F2]" onClick={() => { getData('LRF'); setEvalPage(true) }} >LJF</div>
                <div className="p-2 cursor-pointer hover:bg-[#F2F2F2]" onClick={() => { getData('LRF_P'); setEvalPage(true) }}>LJF - Preemptive</div>
                <div className="p-2 cursor-pointer hover:bg-[#F2F2F2]" onClick={() => { getData('Priority'); setEvalPage(true) }} >Priority</div>
                <div className="p-2 cursor-pointer hover:bg-[#F2F2F2]" onClick={() => { getData('Priority_P'); setEvalPage(true) }}>Priority - Preemptive</div>
                <div className="p-2 cursor-pointer hover:bg-[#F2F2F2]" onClick={() => { getData('RoundRobin'); setEvalPage(true) }}>Round Robin</div>
              </div>
            </div>
          }
        </div>}

      {addPr && (
        <div className="mt-[40px] mx-[40px] h-[450px] bg-[#EFF6FB] shadow-lg rounded-lg">
          <div className="m-3 flex grid justify-items-end">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10 cursor-pointer" onClick={() => { setAddPr(false) }}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="m-5 text-lg">Process  {prNo}</div>
          <div className="">
            <div className="flex justify-center items-center">
              <div className="m-5">Arival Time</div>
              <TextField
                type='number'
                value={at}
                label="Arival Time"
                onChange={(e) => {
                  setAt(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-center items-center">
              <div className="m-5 mr-[25px]">Burst Time</div>
              <TextField
                type='number'
                value={bt}
                label="Burst Time"
                onChange={(e) => {
                  setBt(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-center items-center">
              <div className="m-5 mr-[48px]">Priority</div>
              <TextField
                type='number'
                value={priority}
                label="Priority"
                onChange={(e) => {
                  setPriority(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="cursor-pointer flex justify-center items-center mt-[50px]">
            <div className="w-[300px] h-[30px] text-lg flex bg-[#ACCBE1] rounded-lg shadow-lg justify-center items-center" onClick={onAddPr}>Add
            </div>
          </div>
        </div>
      )}

      {editPr && (
        <div className="mt-[40px] mx-[40px] h-[450px] bg-[#EFF6FB] shadow-lg rounded-lg">
          <div className="m-3 flex grid justify-items-end">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10 cursor-pointer" onClick={() => { setEditPr(false) }}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="m-5 text-lg">Process  {EprNo}</div>
          <div className="">
            <div className="flex justify-center items-center">
              <div className="m-5">Arival Time</div>
              <TextField
                type='number'
                value={Eat}
                label="Arival Time"
                onChange={(e) => {
                  setEAt(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-center items-center">
              <div className="m-5 mr-[25px]">Burst Time</div>
              <TextField
                type='number'
                value={Ebt}
                label="Burst Time"
                onChange={(e) => {
                  setEBt(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-center items-center">
              <div className="m-5 mr-[48px]">Priority</div>
              <TextField
                type='number'
                value={Epriority}
                label="Priority"
                onChange={(e) => {
                  setEPriority(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="cursor-pointer flex justify-center items-center mt-[50px]">
            <div className="w-[300px] h-[30px] text-lg flex bg-[#ACCBE1] rounded-lg shadow-lg justify-center items-center" onClick={onClickEditSave}>Save
            </div>
          </div>
        </div>
      )}

      {evalPage && <div className="">
        <div className="mt-[40px] mx-[40px] h-[400px] bg-[#EFF6FB] shadow-lg rounded-lg">
          <div className="m-3 flex grid justify-items-end">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10 cursor-pointer" onClick={() => { setEvalPage(false) }}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="h-[350px] overflow-y-auto">
            {data &&
              <div className={`grid grid-cols-${data.table.at ? '6' : '5'}`}>
                {data && <div className="">
                  <div className="text-xl font-semibold m-2">Process</div>
                  {data.table.pr?.map((item) => (
                    <div className="text-lg bg-[#FAFAFA] border p-1">{item}</div>
                  ))}
                </div>}
                {data && data.table.at && <div className="">
                  <div className="text-xl font-semibold m-2">Arrival Time</div>
                  {data.table.at?.map((item) => (
                    <div className="text-lg bg-[#FAFAFA] border p-1">{item}</div>
                  ))}
                </div>}
                {data && <div className="">
                  <div className="text-xl font-semibold m-2">Burst Time</div>
                  {data.table.bt?.map((item) => (
                    <div className="text-lg bg-[#FAFAFA] border p-1">{item}</div>
                  ))}
                </div>}
                {data && <div className="">
                  <div className="text-xl font-semibold m-2">Completion Time</div>
                  {data.table.ct?.map((item) => (
                    <div className="text-lg bg-[#FAFAFA] border p-1">{item}</div>
                  ))}
                </div>}
                {data && <div className="">
                  <div className="text-xl font-semibold m-2">Turnaround Time</div>
                  {data.table.tat?.map((item) => (
                    <div className="text-lg bg-[#FAFAFA] border p-1">{item}</div>
                  ))}
                </div>}
                {data && <div className="">
                  <div className="text-xl font-semibold m-2">Waiting Time</div>
                  {data.table.wt?.map((item) => (
                    <div className="text-lg bg-[#FAFAFA] border p-1">{item}</div>
                  ))}
                </div>}
              </div>}
          </div>
        </div>
        <div className="mt-5 flex justify-center items-center h-[100px]">
          {data && <div className="flex justify-center items-center mx-5">
            <div className="text-xl font-semibold m-2">Average Weight</div>
            <div className="text-lg bg-[#FAFAFA] border p-1">{Number(data.wt_avg).toFixed(2)}</div>
          </div>}
          {data && <div className="flex justify-center items-center mx-5">
            <div className="text-xl font-semibold m-2">Average Turn Around Time</div>
            <div className="text-lg bg-[#FAFAFA] border p-1">{Number(data.tat_avg).toFixed(2)}</div>
          </div>}
        </div>
      </div>}
    </div>
  );
}

export default App;
