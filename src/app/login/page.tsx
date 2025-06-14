import React from "react";
import { supabase } from "../../../lib/supabaseClient";

const page = () => {
  const Createname = async () => {
    const { data, error } = await supabase.from("views").insert({
      name: "Erfan Aalam",
    });
    console.log(data);
    console.error(error);
  };

  Createname();

  return <div>this is login page</div>;
};

export default page;
