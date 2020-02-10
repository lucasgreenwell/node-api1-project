import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [trigger, setTrigger] = useState(0);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then(res => {
        // console.log('i happen and i work')
        setUsers(res.data);
      })
      .catch(err => console.log(err));
  }, [trigger]);

  const editUser = user => {
    axios
      .put(`http://localhost:5000/api/users/${user.id}`, user)
      .then(res => {
        console.log(res);
        setEditing(false);
        setTrigger(trigger + 1);
      })
      .catch(err => console.log(err));
  };
  const deleteUser = user => {
    axios
      .delete(`http://localhost:5000/api/users/${user.id}`)
      .then(res => {
        console.log(res);
        setTrigger(trigger + 1);
      })
      .catch(err => console.log(err));
  };
  const makeUser = user => {
    axios.post(`http://localhost:5000/api/users`, user)
      .then(res => {
        console.log(res)
                setTrigger(trigger + 1);

      })
      .catch(err => console.log(err))
  }
  return (
    <div className="App">
      {users.map(user => {
        return editing ? (
          <form onSubmit={handleSubmit(editUser)}>
            <label>
              <p>Name:</p>
              <input
                type="text"
                placeholder={user.name}
                name="name"
                ref={register({ required: true })}
              />
            </label>
            <label>
              <p>Bio:</p>
              <input
                type="text"
                placeholder={user.bio}
                name="bio"
                ref={register({ required: true })}
              />
            </label>
            <label>
              <p>Id:</p>
              <input
                type="text"
                value={user.id}
                name="id"
                ref={register({ required: true })}
              />
            </label>
            <input type="submit" />
          </form>
        ) : (
          <div>
            <p>{user.name}</p>
            <p>{user.bio}</p>
            <p>{user.id}</p>
            <button
              onClick={() => {
                setEditing(true);
              }}
            >
              Edit User
            </button>
            <button
              onClick={() => {
                deleteUser(user);
              }}
            >
              Delete User
            </button>
          </div>
        );
      })}
      <form onSubmit={handleSubmit(makeUser)}>
        <h2>Add new user</h2>
        <label>
              <p>Name:</p>
              <input
                type="text"
                name="name"
                ref={register({ required: true })}
              />
            </label>
            <label>
              <p>Bio:</p>
              <input
                type="text"
                name="bio"
                ref={register({ required: true })}
              />
            </label><br/>
            <input type="submit"/>
      </form>
    </div>
  );
}

export default App;
