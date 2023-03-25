# import http.client
# import json

# conn = http.client.HTTPConnection("localhost", 3500)

# conn.request("GET", "/users")
# res = conn.getresponse()
# data = res.read()

# users = json.loads(data.decode("utf-8"))

# for user in users:
#     habits = user['habits']
#     for habit in habits:
#         records = habit['records']
#         for record in records:
#             if record['date'] < "2023-01-01":
#                 habit_id = habit['_id']
#                 record_id = record['_id']
#                 conn.request("DELETE", f"/users/{user['_id']}/habits/{habit_id}/records/{record_id}")
#                 res = conn.getresponse()
#                 print(res.status, res.reason)
