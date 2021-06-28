import React from "react";
import ExportExcel from "react-export-excel";
import { Button } from 'react-bootstrap'
const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelFile.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelFile.ExcelColumn;

function MarksFormatExport({ studentsList }) {
    return (
        <ExcelFile filename='field-marks-format' element={<Button>Get excel format</Button>}> 
            <ExcelSheet data={studentsList} name="sheet-1">
                <ExcelColumn label="registration_number" value="regNo"/>
                <ExcelColumn label="report_marks" value="report_marks"/>
                <ExcelColumn label="academic_supervisor_marks" value="academic_marks"/>
                <ExcelColumn label="field_supervisor_marks" value="field_marks"/>
            </ExcelSheet>
        </ExcelFile>
    )
}

export default MarksFormatExport

