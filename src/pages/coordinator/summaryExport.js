import React from "react";
import ExportExcel from "react-export-excel";
import { Button } from 'react-bootstrap'
const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelFile.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelFile.ExcelColumn;

function SummaryExport({ studentsList }) {
    return (
        <ExcelFile filename='field-result-summary' element={<Button>Export as Excel</Button>}> 
            <ExcelSheet data={studentsList} name="sheet-1">
                <ExcelColumn label="Registration Number" value="regNo"/>
                <ExcelColumn label="Average" value="avg"/>
                <ExcelColumn label="Grade" value="grade"/>
                {/* <ExcelColumn label="Marital Status"
                                value={(col) => col.is_married ? "Married" : "Single"}/> */}
            </ExcelSheet>
        </ExcelFile>
    )
}

export default SummaryExport

