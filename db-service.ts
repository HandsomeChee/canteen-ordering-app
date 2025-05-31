import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';

const databaseName = 'StudentDB';

enablePromise(true);

const openCallback = () => {
    console.log('database open success');
}

const errorCallback = (err: any) => {
    console.log('Error in opening the database: ' + err);
}

export const getDBConnection =() =>{
    return openDatabase(
        {name:`${databaseName}`},
        openCallback,
        errorCallback,
    );
}

// currently created one (1001, adminid1001)
export const createTableAdmins = async(db:SQLiteDatabase)=>{
    try{
        const query = 'CREATE TABLE IF NOT EXISTS admins(id INTEGER PRIMARY KEY, password VARCHAR(20))'
        await db.executeSql(query);
    }catch(error){
        console.error(error);
        throw Error('Failed to create table for admins!!!');

    }
}

export const createAdmin = async(
    db:SQLiteDatabase,
    id:number,
    password:string
)=>{
    try{
        const query =' INSERT INTO admins(id,password) VALUES(?,?)'
        const parameters=[id,password];
        await db.executeSql(query,parameters);
    }catch(error){
        console.error(error);
        throw Error('Failed to save admins !!!');
    }
}

export const getAdminLogin = async(db:SQLiteDatabase,id:number,password:string)=>{
    try{
        const query = `SELECT * FROM admins WHERE id = ? AND password = ?`;
        const results = await db.executeSql(query, [id,password]);
        return results[0].rows.length;
    }catch(error){
        console.error(error);
        throw Error('Failed to get admins!!!');
    }
}

export const adminExists = async (db: SQLiteDatabase, id: number) => {
    try{
        const results = await db.executeSql('SELECT * FROM admins WHERE id = ?', [id]);
        return results[0].rows.length > 0;
    }catch (error) {
        console.error(error);
        throw Error('Admin has exists !!!');
    }
};

export const createTableStudents = async(db:SQLiteDatabase)=>{
    try{
        const query = 'CREATE TABLE IF NOT EXISTS students(id INTEGER PRIMARY KEY, name VARCHAR(20) UNIQUE, email VARCHAR(20) UNIQUE, phone_number VARCHAR(20) UNIQUE, password VARCHAR(20),credit FLOAT )';
        await db.executeSql(query);
      } catch (error) {
        console.error(error);
        throw Error('Failed to create table for students!!!');
      }
}

export const getStudents = async(db:SQLiteDatabase)=>{
    try{
        const studentData : any = [];
        const query = `SELECT * FROM students ORDER BY name`;
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                studentData.push(item);
            })
          });
        return studentData;
      } catch (error) {
        console.error(error);
        throw Error('Failed to get students !!!');
      }
}

export const getStudentEmail = async (db: SQLiteDatabase, email: string, password: string) => {
    try {
        const query = `SELECT * FROM students WHERE email = ? AND password = ?`;
        const results = await db.executeSql(query, [email, password]);
        if (results[0].rows.length > 0) {
            return results[0].rows.item(0);
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        throw Error('Failed to get student !!!');
    }
};

export const getStudentsPhoneNum=async(db:SQLiteDatabase,phone_number:string,password:string)=>{
    try{
        const query = `SELECT * FROM students WHERE phone_number = ? AND password = ?`;
        const results = await db.executeSql(query, [phone_number, password]);
        if (results[0].rows.length > 0) {
            return results[0].rows.item(0);
        } else {
            return null;
        }
    }catch (error) {
        console.error(error);
        throw Error('Failed to get students !!!');
      }
}

export const getStudentsById = async( db: SQLiteDatabase, id:number )=> {
    try{
        const query = `SELECT * FROM students WHERE id=?`;
        const results = await db.executeSql(query,[id]);
        if (results[0].rows.length > 0) {
            return results[0].rows.item(0);
        } else {
            return null;
        }
      } catch (error) {
        console.error(error);
        throw Error('Failed to get student !!!');
      }
}

export const getStudentBalanceById = async (db: SQLiteDatabase, id: number): Promise<number> => {
    try {
      const query = `SELECT credit FROM students WHERE id = ?`;
      const results = await db.executeSql(query, [id]);
  
      if (results[0].rows.length > 0) {
        return results[0].rows.item(0).credit;
      } else {
        throw new Error(`Student with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error fetching student balance:', error);
      throw error;
    }
};

export const createStudent = async(
    db:SQLiteDatabase,
    id:number,
    name:string,
    email:string,
    phone_number:string,
    password:string,
    credit: number = 0.00
)=>{
    try{
        const query =' INSERT INTO students(id,name,email,phone_number,password,credit) VALUES(?,?,?,?,?,?)'
        const parameters=[id,name,email,phone_number,password,credit];
        await db.executeSql(query,parameters);
    }catch(error){
        console.error(error);
        throw Error('Failed to save students !!!');
    }
}

export const updateStudent = async(
    db:SQLiteDatabase,
    newID:number,
    name:string,
    email:string,
    phone_number:string,
    oldID:number
)=>{
    try{
        const query='UPDATE students SET id =?,name=?,email=?,phone_number=? WHERE id=?';
        const parameters=[newID,name,email,phone_number,oldID]
        await db.executeSql(query, parameters);
    }catch(error){
        console.error(error);
        throw Error('Failed to update students !!!');
    }
}

export const updateStudentsCredit = async (db:SQLiteDatabase,id:string,credit:number)=>{
    try{
        const query='UPDATE students SET credit=? WHERE id=?';
        const parameters=[credit,id]
        await db.executeSql(query, parameters);
    }catch(error){
        console.error(error);
        throw Error('Failed to update students balance !!!');
    }
}

export const updatePasswordByEmail = async (db:SQLiteDatabase, email: string, newPassword: string) => {
    try {
      const result = await db.executeSql(
        'UPDATE students SET password = ? WHERE email = ?',
        [newPassword, email]
      );
      return result[0].rowsAffected > 0;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
};

  export const updatePasswordByPhone = async (db:SQLiteDatabase, phone_number: string, newPassword: string) => {
    try {
      const result = await db.executeSql(
        'UPDATE students SET password = ? WHERE phone_number = ?',
        [newPassword, phone_number]
      );
      return result[0].rowsAffected > 0;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
};

export const deleteStudent = async(db:SQLiteDatabase,id:string)=>{
    try{
        const query='DELETE FROM students WHERE id=?';
        await db.executeSql(query,[id]);
    }catch(error){
        console.error(error);
        throw Error('Failed to delete students !!!');
    }
}