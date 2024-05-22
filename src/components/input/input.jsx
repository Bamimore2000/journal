"use client";
import { useEffect, useState } from "react";
import { useContext } from "react";
import DataContext from "@/app/contexts/dataContext";
import { useRouter } from "next/navigation";
import { GoBookmark } from "react-icons/go";
import { RiPencilFill } from "react-icons/ri";
import { FaBookmark } from "react-icons/fa6";
import {motion, useDragControls, useMotionValue, useAnimate, easeInOut} from 'framer-motion'

const Input = ({}) => {
  const controls = useDragControls()
  const y = useMotionValue(0)
  const [target, animate] = useAnimate()

  
  // for the input
  const now = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: "true",
  };

  

  
  function generateRandomWord(length) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "1234567890";

    for (let i = 0; i < length; i++) {
      // Randomly select a character from 'a' to 'z'
      if (i % 2 === 0) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      } else {
        // Randomly select a number from 1 to 10
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
    }

    return result;
  }

  // Generate a random word with length 10
  
  
  //   console.log(randomWord);

  let data;
  const [isWrong, setIsWrong] = useState(false);
  
  const router = useRouter();

  let {
    array,
    query,
    setQuery,
    editing,
    isEditing,
    saver,
    value,
    bookmarked,
    setIsBookMarked,
    wantsBookMarked, 
    setWantsBookMarks,
    setValue,
    setItem,
    getItem,
    setSaver,
    oneToEdit,
    showModal,
    setShowModal,
  } = useContext(DataContext);

  const handleClose = () =>{
    const yStart = typeof y.get() === 'number' ? y.get(): 0;
    animate(target.current,{
      y: [yStart, 800]
    })
    setQuery(false);
    setSaver('')
    
  }
  

  function handleBookmark(){
    setWantsBookMarks((prev)=> !prev)
  }
  // this function handles when the user is typing
  const handleInput = (e) => {
    // set the input field value to data
    data = e.target.value;
    // set the saver, that is what holds the text, to data
    setSaver(data);
  };

  // this function handles when the user clicks
  const handleClick = () => {
    // if the user has typed something
    if (saver) {
      // grab the new date

      // set the date and time

      // create the object to hold that typing session
      const randomWord = generateRandomWord(10);
      const text = {
        time: now.getTime(),
        id: now.toLocaleString("en-US", options),
        value: saver,
        code: randomWord,
        hasSaved: !wantsBookMarked ? false : true,
      };

      // if the user is editing, this is an utility function
      if (editing) {
        // function to edit the array based on onetoedit and return to localStorage
        const editedArray = getItem().map((data) => {
          if (data.code === oneToEdit) {
            if (data.hasSaved){
              setWantsBookMarks(true);
              return {
                ...data,
                value: text.value,
                hasSaved: !wantsBookMarked ? false : true
              };

            }
            else{
              setWantsBookMarks(false)
              return {
                ...data,
                value: text.value,
                hasSaved: !wantsBookMarked ? false : true
              };
            }
            
          }
          return data;
        });
        // return to local storage
        setItem(editedArray);
        // the user is no longer editing
        isEditing(false);
        console.log(editing);
      }
      // means the user is not editing
      else {
        // spread the previous

        if (getItem()?.length >= 1) {
          // spread the previous array
          let newState = [...getItem(), text];
          array.push(text);
          // then set the new data
          setItem(newState);
        }
        // if the local storage is empty
        else {
          // if starting afresh I must start with an array. This only runs once for all users
          setItem([text]);
        }
        setIsBookMarked(false)
      }
      // ensure the inputField is cleared
      setSaver("");
      setQuery(false);
      router.push("/list");
      setShowModal(false);
    } else {
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
      }, 3000);
      console.log("yes");
    }
  };

  return (
    <motion.div 
    initial={{
      y:100,
      opacity: 0
    }}
    animate={{
      y: 0,
      opacity: 1
    }}
    transition={{
      ease: easeInOut
    }}
    style={{y}}
    drag='y'
    dragElastic={{
      top: 0,
      bottom: 0.2
  }}
  ref={target}

  onDragStart={()=>{
      console.log(y.get());

  }}
  onDragEnd={()=>{
    if (y.get() > 24){
      handleClose()
    }
    console.log(y.get());
  }}
  dragListener={false}

  dragControls={controls}
  dragConstraints={{
    top: 0,
    bottom: 0.5
}}
     className="input"
     >
      {isWrong && (
        <div>
          <h3>Please enter a text</h3>
        </div>
      )}
      <nav 
      onPointerDown={(e)=> {
        controls.start(e);
        console.log("yes");
      }}
      className="cursor-grab touch-none">
        <div onClick={()=> handleBookmark()} className="bookmarkbtn">
          {!wantsBookMarked ? (
            <GoBookmark color="rgb(86, 79, 184)"/>
          ):(
            <FaBookmark color="red"/>
          )}
        </div>
        <div className="date">{now.toLocaleString("en-US", options)}</div>
        <div className="others">
          <div className="more">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div style={{color: 'rgb(86, 79, 184)'}} className="done font-bold" onClick={() => handleClick()}>
            Done
          </div>
        </div>
      </nav>
      <textarea
        value={saver}
        contentEditable={true}
        onChange={(e) => handleInput(e)}
        className="main-input"
        placeholder="Start typing"
        type="text"
      />
    </motion.div>
  );
};
export default Input;
