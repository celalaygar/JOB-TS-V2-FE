import type { LeaveTypeOption } from "../types/leave-type"

export const leaveTypeOptions: LeaveTypeOption[] = [
  { value: "military", en: "Military Leave", tr: "Askerlik İzni" },
  { value: "paternity", en: "Paternity Leave", tr: "Babalık İzni" },
  { value: "maternity", en: "Maternity Leave", tr: "Doğum İzni" },
  { value: "postpartum", en: "Postpartum Leave", tr: "Doğum Sonrası İzni" },
  { value: "marriage", en: "Marriage Leave", tr: "Evlilik İzni" },
  { value: "sick", en: "Sick Leave", tr: "Hastalık İzni" },
  { value: "jobSearch", en: "Job Search Leave", tr: "İş Arama İzni" },
  { value: "compassionate", en: "Compassionate Leave", tr: "Mazeret İzni" },
  { value: "nursing", en: "Nursing Leave", tr: "Süt İzni" },
  { value: "unpaid", en: "Unpaid Leave", tr: "Ücretsiz İzin" },
  { value: "remote", en: "Remote Work Leave", tr: "Uzaktan Çalışma İzni" },
  { value: "bereavement", en: "Bereavement Leave", tr: "Vefat İzni" },
  { value: "annual", en: "Annual Leave", tr: "Yıllık İzin" },
  { value: "travel", en: "Travel Leave", tr: "Yol İzni" },
]
