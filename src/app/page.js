"use client";

import Input from "@/components/input/input";
import Link from "next/link";
import { useContext } from "react";
import DataContext from "./contexts/dataContext";
import { useState } from "react";
const Home = () => {
  const {query, setQuery} = useContext(DataContext);
  return (
    <>
    {query && <Input></Input>}
      <div className="container">
        <div className="itemswrapper">
          <h1>Welcome to journal app!</h1>
          <h2 className="secondary-text">Home for your thoughts</h2>
          <Link className="link-journal" href='/list'>See your notes</Link>
          <button className="btn" onClick={()=> setQuery(true)}>
            <div className="plus">+</div>
          </button>
        </div>
      </div>
      
    </>
      
    
  );
};
export default Home;
