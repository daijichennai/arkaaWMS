<%@ WebHandler Language="VB" Class="putMaster" %>

Imports System
Imports System.Web
Imports System.Data.SqlClient
Imports System.Data
Imports System.Collections.Generic
Imports System.Web.Script.Serialization

Public Class putMaster : Implements IHttpHandler

    Public jsonString As StringBuilder = New StringBuilder()
    Public myVbFun As New vbFunction
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        context.Response.AddHeader("Access-Control-Allow-Origin", "*")
        context.Response.ContentType = "application/json"
        Dim mode As String = ""
        Dim putID As Integer = 0
        Dim pickID As Integer = 0
        Dim intPutDetailsID As Integer = 0
        Dim rackQR As String = ""
        Dim itemCode As String = ""
        Dim itemName As String = ""
        Dim itemQty As String = ""
        Dim userName As String = ""
        Dim putNo As String = ""
        Dim logMode As String = ""
        Dim pickDetailsID As Integer = 0
        mode = context.Request.QueryString("mode")
        putID = context.Request.QueryString("putID")
        intPutDetailsID = context.Request.QueryString("putDetailsID")
        rackQR = context.Request.QueryString("rackQR")
        itemCode = context.Request.QueryString("itemCode")
        itemName = context.Request.QueryString("itemName")
        itemQty = context.Request.QueryString("itemQty")
        userName = context.Request.QueryString("userName")
        putNo = context.Request.QueryString("putNo")
        logMode = context.Request.QueryString("logMode")
        pickDetailsID = context.Request.QueryString("pickDetailsID")
        pickID = context.Request.QueryString("pickID")
        
        If mode = "selectList" Then
            context.Response.Write(getPustMaster(context, "selPutList"))
            
        ElseIf mode = "selPickList" Then
            context.Response.Write(getPickMaster(context,"selPickList"))
            
        ElseIf mode = "selectByID" Then
            context.Response.Write(getPutDetailsMasterByID(context, putID))
            
        ElseIf mode = "selectPickList" Then
            context.Response.Write(getPickDetailsMasterByID(context,pickID))
                                   
        ElseIf mode = "selPutDetByID" Then
            context.Response.Write(getPutDetailsByDetailsID(context, intPutDetailsID))
            
        ElseIf mode = "selPickDetByID" Then
            context.Response.Write(getPickDetailsByDetailsID(context, pickDetailsID))
            
        ElseIf mode = "insPut" Then
            insertPut(context, putID, rackQR, itemCode, itemName, itemQty, userName, intPutDetailsID, putNo, logMode, pickDetailsID,0,"insPut")
            
        ElseIf mode = "insPick" Then
            insertPut(context, 0, rackQR, itemCode, itemName, itemQty, userName, intPutDetailsID, putNo, logMode, pickDetailsID,pickID,"insPick")

        ElseIf mode = "selLog" Then

            context.Response.Write(getLogData(context, userName))
        ElseIf mode = "reset" Then
            context.Response.Write(resetData(context))
        End If
        
            
    End Sub
    
    Protected Function getPustMaster(ByVal context As HttpContext,ByVal qtype As String) As DataTable

        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim dt As New DataTable()

        Try
            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = qtype

            con.dbOpen()
            Dim da As New SqlDataAdapter(Cmd)
            da.Fill(dt)
           
            
            If Not IsNothing(dt) Then
                context.Response.Write(putJson(dt, context))
            Else
                context.Response.Write("No Record Found")
            End If

             
        Catch ex As Exception
            context.Response.Write(ex)
        Finally
            con.dbClose()
        End Try


    End Function
    
    Public Function putJson(ByVal table As DataTable, ByVal context As HttpContext) As String

        If table.Rows.Count > 0 Then
            jsonString.Append("[")
            For i As Integer = 0 To table.Rows.Count - 1
                jsonString.Append("{")


                For j As Integer = 0 To table.Columns.Count - 1
                    'If j < table.Columns.Count - 1 Then
                    '    jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString() + """,")
                    'ElseIf j = table.Columns.Count - 1 Then
                    '    jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString() + """")
                    'End If
                    If j < table.Columns.Count - 1 Then
                        jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString().Replace("""", "'") + """,")
                    ElseIf j = table.Columns.Count - 1 Then
                        jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString().Replace("""", "'") + """")
                    End If

                Next
                
                jsonString.Append(",""items"":")
                getPutNestedJson(table.Rows(i)("putID"), context)

                If i = table.Rows.Count - 1 Then
                    jsonString.Append("}")
                Else
                    jsonString.Append("},")
                End If
            Next
            jsonString.Append("]")
        End If
        putJson = jsonString.ToString()
    End Function

    
    Protected Function getPutNestedJson(ByVal putID As Integer, ByVal context As HttpContext) As DataTable

        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim dt As New DataTable()

        Try
            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure
            Cmd.Parameters.Add("@putID", SqlDbType.Int).Value = putID
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "selectList"

            con.dbOpen()
            Dim da As New SqlDataAdapter(Cmd)
            da.Fill(dt)
            
            If Not IsNothing(dt) Then
                putNestedDetailsJson(dt, context)
            Else
                context.Response.Write("No Record Found")
            End If
        Catch ex As Exception
            context.Response.Write(ex)
        Finally
            con.dbClose()
        End Try
    End Function
    
    
    Public Function putNestedDetailsJson(ByVal table As DataTable, ByVal context As HttpContext) As String
        If table.Rows.Count > 0 Then
            jsonString.Append("[")
            For i As Integer = 0 To table.Rows.Count - 1
                jsonString.Append("{")
                For j As Integer = 0 To table.Columns.Count - 1
                    If j < table.Columns.Count - 1 Then
                        jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString().Replace("""", "'") + """,")
                    ElseIf j = table.Columns.Count - 1 Then
                        jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString().Replace("""", "'") + """")
                    End If
                Next
                If i = table.Rows.Count - 1 Then
                    jsonString.Append("}")
                Else
                    jsonString.Append("},")
                End If
            Next
            jsonString.Append("]")
        End If
        putNestedDetailsJson = jsonString.ToString()
    End Function

    
    Protected Function getPutDetailsByID(ByVal context As HttpContext, ByVal putID As Integer) As String
        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim sqlReader As SqlDataReader
        Dim putDetailsJson As New List(Of Object)()
        Dim jsSerializer As New JavaScriptSerializer()
        Try

            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure

            Cmd.Parameters.Add("@putID", SqlDbType.Int).Value = putID
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "selPutDetByID"

            con.dbOpen()

            sqlReader = Cmd.ExecuteReader()

            If sqlReader.HasRows Then
                sqlReader.Read()
                While sqlReader.Read
                    putDetailsJson.Add(New With { _
                              .putID = sqlReader("putID"), _
                              .putNo = sqlReader("putNo"), _
                              .itemName = sqlReader("itemName") _
                          })
                End While
            Else
                context.Response.Write("else")
            End If

            Return (jsSerializer.Serialize(putDetailsJson))
            
        Catch ex As Exception
            'Response.Write(ex)
        Finally
            con.dbClose()
        End Try
    End Function
    
    
    Protected Function getPutDetailsMasterByID(ByVal context As HttpContext,ByVal putID As Integer) As String
        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim sqlReader As SqlDataReader
        Dim putDetails As New List(Of Object)()
        Dim jsSerializer As New JavaScriptSerializer()
        Try

            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure

            Cmd.Parameters.Add("@putID", SqlDbType.Int).Value = putID
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "selectList"

            con.dbOpen()

            sqlReader = Cmd.ExecuteReader()

            If sqlReader.HasRows Then
                
                While sqlReader.Read
                    putDetails.Add(New With { _
                              .putDetailsID = sqlReader("putDetailsID"), _
                              .putID = sqlReader("putID"), _
                              .putNo = sqlReader("putNo"), _
                              .itemName = sqlReader("itemName"), _
                              .itemCode = sqlReader("itemCode"), _
                              .suggestedLocation = sqlReader("suggestedLocation"), _
                              .itemQty = sqlReader("itemQty") _
                          })
                End While
            End If

            Return (jsSerializer.Serialize(putDetails))
            
        Catch ex As Exception
            'Response.Write(ex)
        Finally
            con.dbClose()
        End Try
    End Function
    
    Protected Function getPutDetailsByDetailsID(ByVal context As HttpContext, ByVal putDetailsID As Integer) As String
        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim sqlReader As SqlDataReader
        Dim getPutDetails As New List(Of Object)()
        Dim jsSerializer As New JavaScriptSerializer()
        Try

            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure

            Cmd.Parameters.Add("@putDetailsID", SqlDbType.Int).Value = putDetailsID
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "selPutDetByID"

            con.dbOpen()

            sqlReader = Cmd.ExecuteReader()

            If sqlReader.HasRows Then
                
                While sqlReader.Read
                    getPutDetails.Add(New With { _
                              .putDetailsID = sqlReader("putDetailsID"), _
                              .putID = sqlReader("putID"), _
                              .itemName = sqlReader("itemName"), _
                              .itemCode = sqlReader("itemCode"), _
                              .suggestedLocation = sqlReader("suggestedLocation"), _
                              .itemQty = sqlReader("itemQty") _
                          })
                End While
            End If

            Return (jsSerializer.Serialize(getPutDetails))
            
        Catch ex As Exception
            'Response.Write(ex)
        Finally
            con.dbClose()
        End Try
    End Function
    
    
    Protected Function insertPut(ByVal context As HttpContext, ByVal putID As Integer, ByVal rackQR As String, ByVal itemCode As String, ByVal itemName As String, ByVal itemQty As String, ByVal userName As String, ByVal putDetailsID As Integer, ByVal putNo As String, ByVal logMode As String,ByVal pickDetailsID As Integer,ByVal pickID As Integer,ByVal qtype As string) As String
        
        Dim rMSG As String = ""
        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
       
        Try
            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure
  
            Cmd.Parameters.Add("@putID", SqlDbType.Int).Value = putID
            Cmd.Parameters.Add("@pickID", SqlDbType.Int).Value = pickID
            Cmd.Parameters.Add("@putNo", SqlDbType.VarChar, 20).Value = putNo
            Cmd.Parameters.Add("@rackQR", SqlDbType.VarChar, 50).Value = rackQR
            Cmd.Parameters.Add("@itemCode", SqlDbType.VarChar, 50).Value = itemCode
            Cmd.Parameters.Add("@itemName", SqlDbType.VarChar, 20).Value = itemName
            
            Cmd.Parameters.Add("@itemQty", SqlDbType.VarChar, 20).Value = itemQty
            Cmd.Parameters.Add("@userName", SqlDbType.VarChar, 20).Value = userName
            Cmd.Parameters.Add("@logMode", SqlDbType.VarChar, 20).Value = logMode
            Cmd.Parameters.Add("@putDetailsID", SqlDbType.Int).Value = putDetailsID
            
            Cmd.Parameters.Add("@pickDetailsID", SqlDbType.Int).Value = pickDetailsID
            
            Cmd.Parameters.Add("@currentDate", SqlDbType.DateTime).Value = DateTime.Now
            
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = qtype
            Cmd.Parameters.Add("@MSG", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output
            con.dbOpen()

            Cmd.ExecuteNonQuery()
            rMSG = Cmd.Parameters("@MSG").Value.ToString
            
            'return rMSG
            'Response.Write(rMSG) 

        Catch ex As Exception
            'startQuiz = ex.ToString
            insertPut = "error"
        Finally
            con.dbClose()
        End Try
        
        insertPut = rMSG
        
    End Function
    
    Protected Function getLogData(ByVal context As HttpContext, ByVal userName As String) As String
        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim sqlReader As SqlDataReader
        Dim logMasterDetails As New List(Of Object)()
        Dim jsSerializer As New JavaScriptSerializer()
        Try

            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure

            Cmd.Parameters.Add("@userName", SqlDbType.VarChar, 20).Value = userName
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "selectLog"

            con.dbOpen()

            sqlReader = Cmd.ExecuteReader()

            If sqlReader.HasRows Then
                While sqlReader.Read
                    logMasterDetails.Add(New With { _
                              .putNo = sqlReader("putNo"), _
                              .logMode = sqlReader("logMode"), _
                              .userName = sqlReader("userName"), _
                              .logDate = myVbFun.dMMMyyyyhhmmss(sqlReader("logDate")) _
                          })
                End While
            Else
                'context.Response.Write("else")
            End If

            Return (jsSerializer.Serialize(logMasterDetails))
            
        Catch ex As Exception
            'Response.Write(ex)
        Finally
            con.dbClose()
        End Try
    End Function

    
    Protected Function resetData(ByVal context As HttpContext) As String
        
        Dim rMSG As String = ""
        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
       
        Try
            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure
           
            
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "resetData"
            Cmd.Parameters.Add("@MSG", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output
            con.dbOpen()

            Cmd.ExecuteNonQuery()
            rMSG = Cmd.Parameters("@MSG").Value.ToString
            

        Catch ex As Exception
            resetData = "error"
        Finally
            con.dbClose()
        End Try
        
        resetData = rMSG
        
    End Function
    
    
    
    Protected Function getPickMaster(ByVal context As HttpContext, ByVal qtype As String) As DataTable

        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim dt As New DataTable()

        Try
            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = qtype

            con.dbOpen()
            Dim da As New SqlDataAdapter(Cmd)
            da.Fill(dt)
           
            
            If Not IsNothing(dt) Then
                context.Response.Write(pickJson(dt, context))
            Else
                context.Response.Write("No Record Found")
            End If

             
        Catch ex As Exception
            context.Response.Write(ex)
        Finally
            con.dbClose()
        End Try


    End Function
    
    Public Function pickJson(ByVal table As DataTable, ByVal context As HttpContext) As String

        If table.Rows.Count > 0 Then
            jsonString.Append("[")
            For i As Integer = 0 To table.Rows.Count - 1
                jsonString.Append("{")


                For j As Integer = 0 To table.Columns.Count - 1
                    'If j < table.Columns.Count - 1 Then
                    '    jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString() + """,")
                    'ElseIf j = table.Columns.Count - 1 Then
                    '    jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString() + """")
                    'End If
                    If j < table.Columns.Count - 1 Then
                        jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString().Replace("""", "'") + """,")
                    ElseIf j = table.Columns.Count - 1 Then
                        jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString().Replace("""", "'") + """")
                    End If

                Next
                
                jsonString.Append(",""items"":")
                getPickNestedJson(table.Rows(i)("pickID"), context)

                If i = table.Rows.Count - 1 Then
                    jsonString.Append("}")
                Else
                    jsonString.Append("},")
                End If
            Next
            jsonString.Append("]")
        End If
        pickJson = jsonString.ToString()
    End Function

    
    Protected Function getPickNestedJson(ByVal pickID As Integer, ByVal context As HttpContext) As DataTable

        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim dt As New DataTable()

        Try
            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure
            Cmd.Parameters.Add("@pickID", SqlDbType.Int).Value = pickID
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "selectPickList"

            con.dbOpen()
            Dim da As New SqlDataAdapter(Cmd)
            da.Fill(dt)
            
            If Not IsNothing(dt) Then
                pickNestedDetailsJson(dt, context)
            Else
                context.Response.Write("No Record Found")
            End If
        Catch ex As Exception
            context.Response.Write(ex)
        Finally
            con.dbClose()
        End Try
    End Function
    
    
    Public Function pickNestedDetailsJson(ByVal table As DataTable, ByVal context As HttpContext) As String
        If table.Rows.Count > 0 Then
            jsonString.Append("[")
            For i As Integer = 0 To table.Rows.Count - 1
                jsonString.Append("{")
                For j As Integer = 0 To table.Columns.Count - 1
                    If j < table.Columns.Count - 1 Then
                        jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString().Replace("""", "'") + """,")
                    ElseIf j = table.Columns.Count - 1 Then
                        jsonString.Append("""" + table.Columns(j).ColumnName.ToString() + """:" + """" + table.Rows(i)(j).ToString().Replace("""", "'") + """")
                    End If
                Next
                If i = table.Rows.Count - 1 Then
                    jsonString.Append("}")
                Else
                    jsonString.Append("},")
                End If
            Next
            jsonString.Append("]")
        End If
        pickNestedDetailsJson = jsonString.ToString()
    End Function
    
    
    Protected Function getPickDetailsMasterByID(ByVal context As HttpContext, ByVal pickID As Integer) As String
        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim sqlReader As SqlDataReader
        Dim pickDetails As New List(Of Object)()
        Dim jsSerializer As New JavaScriptSerializer()
        ''context.Response.Write(pickID)
        Try

            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure

            Cmd.Parameters.Add("@pickID", SqlDbType.Int).Value = pickID
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "selectPickList"

            con.dbOpen()

            sqlReader = Cmd.ExecuteReader()

            If sqlReader.HasRows Then
                While sqlReader.Read
                    pickDetails.Add(New With { _
                              .pickDetailsID = sqlReader("pickDetailsID"), _
                              .pickID = sqlReader("pickID"), _
                              .pickNo = sqlReader("pickNo"), _
                              .itemName = sqlReader("itemName"), _
                              .itemCode = sqlReader("itemCode"), _
                              .suggestedLocation = sqlReader("suggestedLocation"), _
                              .itemQty = sqlReader("itemQty") _
                          })
                End While
            Else
                context.Response.Write("else")
            End If

            Return (jsSerializer.Serialize(pickDetails))
            
        Catch ex As Exception
            'Response.Write(ex)
        Finally
            con.dbClose()
        End Try
    End Function
    
    Protected Function getPickDetailsByDetailsID(ByVal context As HttpContext, ByVal pickDetailsID As Integer) As String
        Dim con As New dbConnection
        Dim Cmd As New SqlCommand
        Dim sqlReader As SqlDataReader
        Dim getPickDetails As New List(Of Object)()
        Dim jsSerializer As New JavaScriptSerializer()
        Try

            Cmd = New SqlCommand("sp_b_putMaster", con.sqlCon)
            Cmd.CommandType = CommandType.StoredProcedure

            Cmd.Parameters.Add("@pickDetailsID", SqlDbType.Int).Value = pickDetailsID
            Cmd.Parameters.Add("@qtype", SqlDbType.VarChar, 50).Value = "selPickDetByID"

            con.dbOpen()

            sqlReader = Cmd.ExecuteReader()

            If sqlReader.HasRows Then
                
                While sqlReader.Read
                    getPickDetails.Add(New With { _
                              .pickDetailsID = sqlReader("pickDetailsID"), _
                              .pickID = sqlReader("pickID"), _
                              .itemName = sqlReader("itemName"), _
                              .itemCode = sqlReader("itemCode"), _
                              .suggestedLocation = sqlReader("suggestedLocation"), _
                              .itemQty = sqlReader("itemQty") _
                          })
                End While
            End If

            Return (jsSerializer.Serialize(getPickDetails))
            
        Catch ex As Exception
            'Response.Write(ex)
        Finally
            con.dbClose()
        End Try
    End Function
    
    
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class