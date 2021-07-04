import React from "react";
import ExportExcel from "react-export-excel";
import { Button } from 'react-bootstrap'
const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelFile.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelFile.ExcelColumn;

function StudentsExport({ studentsList }) {
    return (
        <ExcelFile filename='students-list-template' element={<Button>Get template</Button>}> 
            <ExcelSheet data={studentsList} name="sheet-1">
                <ExcelColumn label="registration_number" value="registration_number"/>
                <ExcelColumn label="first_name" value="first_name"/>
                <ExcelColumn label="last_name" value="last_name"/>
                <ExcelColumn label="email" value="email"/>
                <ExcelColumn label="phone_number" value="phone_number"/>
                <ExcelColumn label="year_of_study" value="year_of_study"/>
                <ExcelColumn label="degree_program" value="degree_program"/>
                <ExcelColumn label="department" value="department"/>
                {/* <ExcelColumn label="Marital Status"
                                value={(col) => col.is_married ? "Married" : "Single"}/> */}
            </ExcelSheet>
        </ExcelFile>
    )
}

export default StudentsExport

