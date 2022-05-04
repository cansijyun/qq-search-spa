import { useState, useCallback, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios'
import _debounce from 'lodash/debounce';

import './App.css';

interface QqRes {
  // qq number
  qq:string;
  // nickName
  name:string;
  // avatar url 
  qlogo:string;
}

type SearchState = 'init' | 'pending' | 'success' | 'noResult' | 'inputNotValid'

const App = () => {
  const debounceMillisecond:number = 800; 
  // Search request state
  const [searchState,setSearchState] = useState<SearchState>('init')
  // Input value to search qq data
  const [filterStr,setFilterStr] = useState<string>('')
  const [qqRes,setQqRes] = useState<QqRes>()
  // Controlled component
  const filterChange = async(e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterStr(value);
    //Debouced
    debounceSearch(value);
  }

  const searchQQNum = async(qq:string)=>{
    const isQqValid = validateQQFilter(qq);
    // Request won't be sent if qq input is invalid 
    if(isQqValid){
      setSearchState('pending');
      const {data:qqSearchRes} = await getQqData(qq);
      setQqRes(qqSearchRes);
      if(qqSearchRes.code === 1){
        setSearchState('success');
      }
    }else{
      setSearchState('inputNotValid');
    }

  }
  const getQqData = async(qq:string) => {
    return axios.get('https://api.uomg.com/api/qq.info', {
      params: {
        qq: qq,
      }
    })
  }
  // Debouced search 
  const debounceSearch = useCallback(_debounce(searchQQNum,debounceMillisecond),[])

  const validateQQFilter = (value:string):boolean => {
    const qqReg =  new RegExp("^[1-9][0-9]{4,12}$")
    return qqReg.test(value);
  }

  return (
    <div className="app-page">
        <h1>
          QQ号查询
        </h1>
        <div className='seach-input'>
          <span>QQ</span>
          <input
            value={filterStr}
            onChange={filterChange} 
            type = "text"
            data-testid="qq-input"
          />
        </div>

        { searchState === 'pending' &&
          <div className='pending-spinner'>
            <div  className='spinner-icon-box'>
              <img src="/spinner.svg" className='spinner-icon'/>
            </div>
            <div>
              查找中...
            </div>
          </div>
        }
        { searchState === 'success' &&
          <div className='qq-card' data-testid="qq-card">
            <div className="img-placeHolder">
              <img src={qqRes?.qlogo} />
            </div>
            <div className="name-code">
              <div>{qqRes?.qq}</div>
              <div>{qqRes?.name}</div>
            </div>

          </div>
        }
        { searchState === 'inputNotValid' &&
          <div data-testid="input-not-valid" className='input-invalid'>
            输入的qq号不是纯数字，并且不能是0开头，5-13位
          </div>
        }
    </div>
  );
}

export default App;

