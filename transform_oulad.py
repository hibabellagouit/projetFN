import pandas as pd

vle = pd.read_csv('studentVle.csv')
info = pd.read_csv('studentInfo.csv')

vle['date'] = pd.to_numeric(vle['date'], errors='coerce')
vle = vle[vle['date'] >= 0]

vle['week'] = (vle['date'] // 7) + 1
vle['courseId'] = (vle['code_module'].astype(str) + vle['code_presentation'].astype(str)).astype('category').cat.codes + 1

info['courseId'] = (info['code_module'].astype(str) + info['code_presentation'].astype(str)).astype('category').cat.codes + 1
info['label'] = info['final_result'].map({'Pass': 0, 'Distinction': 0, 'Fail': 1, 'Withdrawn': 1}).fillna(0).astype(int)

weekly = vle.groupby(['id_student', 'courseId', 'week']).agg({
    'sum_click': 'sum',
    'date': 'nunique',
    'id_site': 'nunique'
}).reset_index()

weekly.columns = ['studentId', 'courseId', 'week', 'totalEvents', 'logins', 'resourceViews']
weekly['submissions'] = 0

result = weekly.merge(info[['id_student', 'courseId', 'label']], left_on=['studentId', 'courseId'], right_on=['id_student', 'courseId'], how='left')
result['label'] = result['label'].fillna(0).astype(int)
result[['studentId', 'courseId', 'week', 'totalEvents', 'logins', 'resourceViews', 'submissions', 'label']].to_csv('weekly_features.csv', index=False)

