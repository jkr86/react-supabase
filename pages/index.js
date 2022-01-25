import { useState, useEffect } from "react";
import Address from "../components/address";
// import { supabase } from "../utils/supabaseClient";

export default function Home() {
  return (
    <div className='container mx-auto mt-24'>
      <Address />
    </div>
  );
}
