"use client";
import { FaBookmark } from "react-icons/fa6";
import { GoBookmarkSlash } from "react-icons/go";
import { GoBookmark } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiPencilFill } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";


import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import DataContext from "../contexts/dataContext";
import Input from "@/components/input/input";
import Link from "next/link";

const Page = () => {
  
  
  const divRefs = useRef([]);
  let {
    query,
    setQuery,
    setSaver,
    setOneToEdit,
    getItem,
    setItem,
    isEditing,
    showModal,
    setWantsBookMarks,
    bookmarked,
    setIsBookMarked,
    setShowModal,
  } = useContext(DataContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showModal === true && !e.target.classList.contains('important')) {
        console.log(showModal);
        setShowModal(false);
      }
    };
  
    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleClickOutside);
    }
  
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [showModal]);


  useEffect(()=>{
    const handleScroll = (e) =>{
      if (showModal){
        setShowModal(false)
      }
    }
  
      if (typeof window !== undefined){
        window.addEventListener('scroll', handleScroll)
      }
  
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('scroll', handleScroll);
        }}
    
  }, [showModal])
  

  
  

  const [enough, setEnough] = useState(false);
  const maxLength = 300;
  const [overflow, setHasOverFlow] = useState(false);

  const [render, setRender] = useState(() => {
    const filteredJournal = getItem()?.filter((data) => {
      return data.hasSaved != false;
    });
    return filteredJournal;
  });
  const [editId, setEditId] = useState(false);
  const divRef = useRef(null);
  const [isTop, setIsTop] = useState(true);
  // const [bookmarked, setIsBookMarked] = useState(false);
  const [textHolder, setTextHolder] = useState(false);
  // takes the id of the journal article clicked
  const [photos, setPhotos] = useState(undefined);

  if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
      setRender(getItem());
    });
  }

  useEffect(() => {
    setRender(() => {
      const filteredJournal = getItem()?.filter((data) => {
        return data.hasSaved != false;
      });
      return filteredJournal;
    });
  }, [showModal]);

  // handling second modal
  const handleSecondModal = (id) => {
    setShowModal(true);
    setEditId(id)
  };

  const [divsClicked, setDivsClicked] = useState([]);

  // function to show more text
  const showText = (id) => {
    if (divsClicked.includes(id)) {
      setDivsClicked((prev) => {
        const filtered = prev.filter((data) => {
          return data !== id;
        });
        return filtered;
      });
    } else {
      setDivsClicked((prev) => {
        return [...prev, id];
      });
    }
  };

  //   function to edit
  const editingValue = (id) => {
    // if the function is called set that editing is true
    isEditing(true);
    // takes in an id and run a find to get specific article
    let found = getItem().find((data) => {
      let seen = data.code === id;

      if (data.hasSaved) {
        setWantsBookMarks(true);
      } else {
        setWantsBookMarks(false);
      }
      return seen;
    });
    // sets the id to onetoedit which is sent to the input component
    // the rest of the editing happens in the input component
    setOneToEdit(found.code);
    // set the text value to the input value, the rest happens in the input component
    setSaver(found.value);

    // this brings up the input component on the screen
    setQuery(true);
  };

  // function to bookmark
  const bookmark = (id, hasSaved) => {
    let editedArray;
    if (!hasSaved) {
      editedArray = getItem().map((data) => {
        if (data.code === id) {
          return {
            ...data,
            hasSaved: true,
          };
        }
        return data;
      });
      // return to local storage
    } else {
      editedArray = getItem().map((data) => {
        if (data.code === id) {
          return {
            ...data,
            hasSaved: false,
          };
        }
        return data;
      });
    }
    setItem(editedArray);
    setShowModal((prev) => !prev);
  };

  //   function to delete
  const deleting = (id) => {
    const updatedJournal = getItem().filter((data) => {
      return data.code != id;
    });
    // sets the updated item to the local storage
    setShowModal(false);
    setItem(updatedJournal);
  };

  const handleBookmark = () => {
    setIsBookMarked(true);
    const filteredJournal = getItem().filter((data) => {
      return data.hasSaved != false;
    });
    setRender(filteredJournal);
    setShowModal((prev) => !prev);
  };

  const handleAll = () => {
    setIsBookMarked(false);
    setShowModal(false);
    setRender(getItem());
    // setRender(getItem());
  };

  // function to handle the display whether pictures or journals or bookmarked
const modalHandle = (id) =>{
  setEditId(id)
  setShowModal(true)
}
  // this function
  const set = (index) => {
    if (typeof window !== "undefined") {
      const divToAccess = divRefs.current[index];
      let rect = divToAccess.getBoundingClientRect();
      let percent = (rect.top / window.innerWidth) * 100;
      // if the item is in the top 50% of the screen
      if (percent > 50) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
      //ensures that the subdiv shows up
      // setEditId(id);
      // this set the id to keep track of the div clicked
      // setShowModal(true);

      // if the subdiv is not visible anywhere, show it
      // if (!showModal) {
      //   setShowModal(true);
      // }
      // removed because thier feature is different
      // if the subdiv is visible but the same div is clicked again, remove the subdiv
      // if (showModal && previous === id) {
      //   setShowModal(false);
      // }
    }
  };

  // useEffect(()=>{
  //   setRender(getItem())
  // }, [se])
  useEffect(() => {
    const hasBookmarks = getItem()?.some(item => item.hasSaved);
    setEnough(hasBookmarks);
  }, [query, showModal, getItem]);

  return (
    <>
      {query && <Input></Input>}
      <div className="container journal-home">
        {/* {
          showModal && <div onClick={()=> {
            setShowModal(false);
            console.log(showModal);
          
          }} className="absolute bg-black/ h-[100vh] z-100 w-[100vw]"></div>
        } */}
        

        
      
      
        {/* <header className="container fixed-header">
        {isScrolledPast && (
          <div className="wrapper container">
            <h3>Journal</h3>
            <div className="sort">Sort</div>
          </div>
        )}
      </header> */}

        <button className="btn" onClick={() => setQuery(true)}>
          <div className="plus">+</div>
        </button>

        <div className="container relative">
        
        
          <header className="header">
            <Link href='/' className="font-bold text-[40px]">Journal</Link>
            <div className="sort">
              <div className="sorted-info">
                {bookmarked && (
                  <>
                    <h5>Filtered by</h5>
                    <h6 style={{ color: "#564fb8" }}>Bookmarked</h6>
                  </>
                )}
              </div>
              <div
                style={{ backgroundColor: bookmarked && "#564fb8" }}
                onClick={() => handleSecondModal('modal' )}
                className="three"
              >
                <div className="first"></div>
                <div className="second"></div>
                <div className="third"></div>
              </div>
              {showModal && editId === 'modal' && (
                <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} // Initial state: hidden with smaller scale
                  animate={{ opacity: 1, scale: 1 }}
                        // Exit state: hidden with smaller scale
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                className="second-modal">
                  <div onClick={() => handleAll()} className="all-entries">
                    <div className="name-of">All Entries</div>
                    <div className="icon">
                      {!bookmarked && !photos && <IoMdCheckmark color="white"/>}
                    </div>
                  </div>
                  {enough && (
                    <div
                      onClick={() => handleBookmark()}
                      className="bookmarked"
                    >
                      <div className="name-of">Bookmarked</div>
                      <div className="icon">
                        {bookmarked && !photos && <IoMdCheckmark color="white"/>}
                      </div>
                    </div>
                  )}
                  <div className="photos">
                    <div className="name-of">Photos</div>
                    <div className="icon">
                      {!bookmarked && photos && <IoMdCheckmark color="white"/>}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </header>
          {/* this getitem must return an array */}
          {bookmarked ? (
            render?.length >= 1 ? (
              render?.map((data, index) => {
                return (
                  <div
                    ref={(el) => (divRefs.current[index] = el)}
                    key={index}
                    className="journal "
                  >
                    {editId === data?.code && showModal &&(
                      <AnimatePresence initial={false}>
                        <motion.div
                        initial={{ opacity: 0, scale: 0.5 }} // Initial state: hidden with smaller scale
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }} // Exit state: hidden with smaller scale
                        transition={{ duration: 0.3 }}
                        style={{ top: isTop && "-71%" }}
                        className="edit-book-del"
                      >
                        <div
                          onClick={() => editingValue(data.code)}
                          className="edit-btn flex justify-between"
                        >
                          <h3 className="important">Edit</h3>
                          <div className="pen">
                            <RiPencilFill color="white" />
                          </div>
                        </div>
                        <div
                          onClick={() => bookmark(data.code, data.hasSaved)}
                          className="needed bookmark flex justify-between"
                        >
                          {!data.hasSaved ? (
                            <>
                              <h3 className="important">Bookmark</h3>
                              <div className="save">
                                <GoBookmark />
                              </div>
                            </>
                          ) : (
                            <>
                              <h3 className="important">Remove Bookmark</h3>
                              <div className="save">
                                <GoBookmarkSlash />
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          onClick={() => deleting(data.code)}
                          className="needed delete flex justify-between"
                        >
                          <h3 className="important">Delete</h3>
                          <div className="bin">
                            <RiDeleteBin6Line color="red" />
                          </div>
                        </div>
                      </motion.div>
                      </AnimatePresence>
                    )}
                    <div className="text-itself">
                      <h4>{data.value}</h4>
                    </div>
                    <div className="date">
                      <div className="actual-date">{data.id}</div>
                      <div className="dot-book">
                        {data.hasSaved && (
                          <div className="bookmarked">
                            <FaBookmark color="red" />
                          </div>
                        )}
                        <div
                          onClick={() => {
                            set(index)
                            handleSecondModal(data.code)
                          }}
                          className="edit"
                        >
                          <div className="dott"></div>
                          <div className="dott"></div>
                          <div className="dott"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="new-user">
                <h3>Hi there, you do not have any bookmarks yet!</h3>
              </div>
            )
          ) : getItem()?.length >= 1 ? (
            getItem()?.map((data, index) => {
              return (
                <div
                  ref={(el) => (divRefs.current[index] = el)}
                  key={index}
                  className="journal "
                >
                  {editId === data?.code && showModal && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }} // Initial state: hidden with smaller scale
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }} // Exit state: hidden with smaller scale
                        transition={{ duration: 0.3 }}
                        style={{ top: isTop && "-75%" }}
                        className="edit-book-del"
                      >
                        <div
                          onClick={() => editingValue(data.code)}
                          className="needed edit-btn flex justify-between"
                        >
                          <h3 className="important">Edit</h3>
                          <div className="pen">
                            <RiPencilFill color="white" />
                          </div>
                        </div>
                        <div
                          onClick={() => bookmark(data.code, data.hasSaved)}
                          className="needed bookmark flex justify-between"
                        >
                          {!data.hasSaved ? (
                            <>
                              <h3 className="important">Bookmark</h3>
                              <div className="save">
                                <GoBookmark />
                              </div>
                            </>
                          ) : (
                            <>
                              <h3 className="important">Remove Bookmark</h3>
                              <div className="save">
                                <GoBookmarkSlash />
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          onClick={() => deleting(data.code)}
                          className="needed delete flex justify-between"
                        >
                          <h3 className="important">Delete</h3>
                          <div className="bin">
                            <RiDeleteBin6Line color="red" />
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                  <div
                    onClick={() => showText(data.code)}
                    className="text-itself"
                  >
                    <h4>
                      {data.value.length > maxLength
                        ? divsClicked.includes(data.code)
                          ? data.value
                          : `${data.value.slice(0, maxLength)}...`
                        : data.value}
                    </h4>
                    {console.log(data.value.length)}
                  </div>
                  <div className="date">
                    <div className="actual-date">{data.id}</div>
                    <div className="dot-book">
                      {data.hasSaved && (
                        <div className="bookmarked">
                          <FaBookmark color="red" />
                        </div>
                      )}
                      <div
                       onClick={() => {
                        set(index)
                        handleSecondModal(data.code)
                      }}
                        className="edit"
                      >
                        <div className="dott"></div>
                        <div className="dott"></div>
                        <div className="dott"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="new-user">
              <h3 className="info">Hi there, you do not have any notes yet!</h3>
            </div>
          )}

          {}
        </div>
      </div>
    </>
  );
};
export default Page;
