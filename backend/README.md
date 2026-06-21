# HEUFT Smart Regal — Backend (Auth + RBAC)

Gerçek kullanıcı yönetimi ve kalıcı veri için Express + JWT + bcrypt iskeleti.

## Kurulum / Installation
```bash
cd heuft_regal_system/backend
npm install
npm start            # http://localhost:4000
```

## Demo kullanıcılar / Demo users
| Kullanıcı | Şifre | Rol |
|-----------|-------|-----|
| `admin`    | `1234` | admin (tam yetki) |
| `operator` | `1234` | operator (salt-okuma) |

İlk çalıştırmada `data.json` otomatik oluşturulur (şifreler bcrypt ile hash'lenir).

## API
| Method | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| POST | `/api/login` | herkes | JWT token döner |
| POST | `/api/change-password` | oturum | şifre değiştir |
| GET  | `/api/state` | oturum | ARTS/RFIDS/RD oku |
| PUT  | `/api/state` | **admin** | veri yaz (RBAC) |
| GET  | `/api/audit` | **admin** | işlem geçmişi |
| GET  | `/api/health` | herkes | sağlık kontrolü |

## Frontend bağlama / Wiring the frontend
`HEUFT_Sunum.html` şu an istemci tarafı auth ile çalışır (sunum için).
Gerçek backend'e geçmek için `doLogin()` içindeki yerel `USERS` kontrolünü
`POST /api/login` çağrısıyla, `commit()` sonrası veriyi `PUT /api/state`
ile değiştirin; `Authorization: Bearer <token>` başlığını ekleyin.

> Not: Bu sunucu CDP/preview ortamında otomatik test edilmez; yerelde
> `npm start` ile çalıştırılıp `curl http://localhost:4000/api/health` ile
> doğrulanabilir.
