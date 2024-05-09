'use client'
import { createContext, useState } from "react"; 

let DataContext = createContext();

export const DataContextComp = ({children}) => {
    
    const [value, setValue] = useState([]);
    const array = [];
    const [query, setQuery] = useState(false);
    const [saver, setSaver] = useState('');
    const [editing, isEditing] = useState(false);
    const [oneToEdit, setOneToEdit] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [bookmarked, setIsBookMarked] = useState(false);
    const [wantsBookMarked, setWantsBookMarks] = useState(false)

    const  setItem = (data)=>{
        let stringified = JSON.stringify(data);
        if (typeof localStorage != undefined){
          localStorage.setItem('journals', stringified);
        }
        
      };

      
    
      const getItem = ()=>{
        if (typeof localStorage != undefined){
          const itemWanted = localStorage.getItem('journals');
          const itemGotten = JSON.parse(itemWanted);
          if (itemGotten?.length > 1){
            itemGotten.sort((a, b) => {
              return b.time - a.time
            })
          }
          else{
            return itemGotten
          }
          return itemGotten;
        }
        
      }
    


    return(
        <DataContext.Provider value={{value, setValue, wantsBookMarked, setWantsBookMarks, bookmarked, setIsBookMarked, array, showModal, setShowModal, getItem, setItem, query, setQuery, editing, isEditing, saver, setSaver, oneToEdit, setOneToEdit}}>
            {children}
        </DataContext.Provider>
    ) 

  
}
export default DataContext