"use client";
import { useContext, useEffect, useRef, useState } from "react";
import DataContext from "../contexts/dataContext";
import Input from "@/components/input/input";

const Page = () => {
  const divRefs = useRef([]);
  let {
    array,
    query,
    setQuery,
    saver,
    setSaver,
    oneToEdit,
    setOneToEdit,
    editing,
    getItem,
    setItem,
    isEditing,
    showModal,
    wantsBookMarked,
    setWantsBookMarks,
    bookmarked, 
    setIsBookMarked,
    setShowModal,
  } = useContext(DataContext);

  const [enough, setEnough] = useState(false);

  
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
  const [displayBookmarks, setDisplayBookmarks] = useState(false);
  // takes the id of the journal article clicked
  const [previous, setPrevious] = useState(0);
  const [photos, setPhotos] = useState(undefined)

  window.addEventListener("DOMContentLoaded", () => {
    setRender(getItem());
  });

  useEffect(() => {
    setRender(() => {
      const filteredJournal = getItem()?.filter((data) => {
        return data.hasSaved != false;
      });
      return filteredJournal;
    });
  }, [showModal]);

  console.log(getItem());

  // handling second modal
  const handleSecondModal = () => {
    setPrevious(null);
    setShowModal((prev) => !prev);
  };

  //   function to edit
  const editingValue = (id) => {
    // if the function is called set that editing is true
    isEditing(true);
    // takes in an id and run a find to get specific article
    let found = getItem().find((data) => {
      let seen = data.code === id;

      if(data.hasSaved){
        setWantsBookMarks(true)
      }
      else{
        setWantsBookMarks(false)
      }
      return seen ;
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

  // this function
  const set = (id, index) => {
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
    setEditId(id);
    // this set the id to keep track of the div clicked
    setPrevious(id);
    setShowModal((prev) => !prev);

    // if the subdiv is not visible anywhere, show it
    // if (!showModal) {
    //   setShowModal(true);
    // }
    // removed because thier feature is different
    // if the subdiv is visible but the same div is clicked again, remove the subdiv
    // if (showModal && previous === id) {
    //   setShowModal(false);
    // }
  };

  // useEffect(()=>{
  //   setRender(getItem())
  // }, [se])
  useEffect(()=>{
    getItem()?.map((data)=>{
      if(data.hasSaved){
        setEnough(true)
      }
      else{
        setEnough(false)
      }
    })
  }, [query, showModal])

  return (
    <>
    {query && <Input></Input>}
      <div className="container journal-home">
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

        <div className="container">
          <header className="header">
            <h1>Journal</h1>
            <div className="sort">
              <div className="sorted-info">
                {bookmarked && (
                  <>
                    <h5 >Filtered by</h5>
                    <h6 style={{color: "#564fb8"}}>Bookmarked</h6>
                  </>
                )}
              </div>
              <div style={{ backgroundColor: bookmarked && "#564fb8" }} onClick={() => handleSecondModal()} className="three">
                <div className="first"></div>
                <div className="second"></div>
                <div className="third"></div>
              </div>
              {showModal && previous === null && (
                <div className="second-modal">
                  <div onClick={() => handleAll()} className="all-entries">
                    <div className="name-of">All Entries</div>
                    <div className="icon">{!bookmarked && !photos && 'marked'}</div>
                  </div>
                  {enough && (
                    <div onClick={() => handleBookmark()} className="bookmarked">
                    <div className="name-of">Bookmarked</div>
                    <div className="icon">{bookmarked && !photos && 'marked'}</div>
                  </div>
                  )}
                  <div className="photos">
                    <div className="name-of">Photos</div>
                    <div className="icon">
                      {!bookmarked && photos && 'marked'}
                    </div>
                  </div>
                </div>
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
                    {editId === data?.code && showModal && previous != null && (
                      <div
                        style={{ top: isTop && "-19%" }}
                        className="edit-book-del"
                      >
                        <div
                          onClick={() => editingValue(data.code)}
                          className="edit-btn"
                        >
                          <h3>Edit</h3>
                          <div className="pen"></div>
                        </div>
                        <div
                          onClick={() => bookmark(data.code, data.hasSaved)}
                          className="bookmark"
                        >
                          {!data.hasSaved ? (
                            <>
                              <h3>Bookmark</h3>
                              <div className="save"></div>
                            </>
                          ) : (
                            <>
                              <h3> Remove Bookmark</h3>
                              <div className="save"></div>
                            </>
                          )}
                        </div>
                        <div
                          onClick={() => deleting(data.code)}
                          className="delete"
                        >
                          <h3>Delete</h3>
                          <div className="bin"></div>
                        </div>
                      </div>
                    )}
                    <div className="text-itself">
                      <h4>{data.value}</h4>
                    </div>
                    <div className="date">
                      <div className="actual-date">{data.id}</div>
                      <div className="dot-book">
                        {data.hasSaved && (
                          <div className="bookmarked">booked</div>
                        )}
                        <div
                          onClick={() => set(data.code, index)}
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
                  {editId === data?.code && showModal && previous != null && (
                    <div
                      style={{ top: isTop && "-19%" }}
                      className="edit-book-del"
                    >
                      <div
                        onClick={() => editingValue(data.code)}
                        className="edit-btn"
                      >
                        <h3>Edit</h3>
                        <div className="pen"></div>
                      </div>
                      <div
                        onClick={() => bookmark(data.code, data.hasSaved)}
                        className="bookmark"
                      >
                        {!data.hasSaved ? (
                          <>
                            <h3>Bookmark</h3>
                            <div className="save"></div>
                          </>
                        ) : (
                          <>
                            <h3> Remove Bookmark</h3>
                            <div className="save"></div>
                          </>
                        )}
                      </div>
                      <div
                        onClick={() => deleting(data.code)}
                        className="delete"
                      >
                        <h3>Delete</h3>
                        <div className="bin"></div>
                      </div>
                    </div>
                  )}
                  <div className="text-itself">
                    <h4>{data.value}</h4>
                  </div>
                  <div className="date">
                    <div className="actual-date">{data.id}</div>
                    <div className="dot-book">
                      {data.hasSaved && (
                        <div className="bookmarked">booked</div>
                      )}
                      <div
                        onClick={() => set(data.code, index)}
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
