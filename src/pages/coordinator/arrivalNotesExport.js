import React from "react";
import ExportExcel from "react-export-excel";
import { Button } from 'react-bootstrap'
const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelFile.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelFile.ExcelColumn;

function ArrivalNotesExport({ studentsList }) {
    return (
        <ExcelFile filename='field-students-arrival-notes' element={<Button>Export as Excel</Button>}> 
            <ExcelSheet data={studentsList} name="sheet-1">
                <ExcelColumn label="Registration Number" value="regNo"/>
                <ExcelColumn label="Organization" value="organization"/>
                <ExcelColumn label="Supervisor First Name" value="supervisor_first_name"/>
                <ExcelColumn label="Supervisor Last Name" value="supervisor_last_name"/>
                {/* <ExcelColumn label="Marital Status"
                                value={(col) => col.is_married ? "Married" : "Single"}/> */}
            </ExcelSheet>
        </ExcelFile>
    )
}

export default ArrivalNotesExport

