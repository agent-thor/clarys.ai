import Form from 'next/form';

import {Input} from './ui/input';
import {Label} from './ui/label';
import {useState} from "react";

export function AuthForm({
                             action,
                             children,
                             defaultEmail = '',
                         }: {
    action: (formData: FormData) => void
    /*NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
>;*/
    children: React.ReactNode;
    defaultEmail?: string;
}) {

    const [formData, setFormData] = useState({email: ""});
    // const handleChange = (e/*React.ChangeEvent<HTMLInputElement>*/) => {
    //
    //     e.target.value
    //     // debugger;
    //     setFormData({...formData, [e.target.name]: e.target.value});
    // };
    const keyUpFunction = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    return (
        <Form action={(formData) => {
            action(formData);
        }} className="flex-1 flex flex-col gap-4 w-full" noValidate>
            <div className="flex flex-col gap-2">
                <Input
                    id="email"
                    key="email"
                    name="email"
                    className="bg-muted text-md md:text-sm "
                    // type="email"
                    placeholder="user@acme.com"
                    autoComplete="email"
                    // onChange={handleChange}
                    required
                    autoFocus
                    // value={formData.email}
                    defaultValue={defaultEmail}
                    onKeyUp={keyUpFunction}
                />{
                defaultEmail
            }

                {/*   <Input
                    id="password"
                    name="password"
                    className="bg-muted text-md md:text-sm"
                    type="password"
                    required
                  />
                </div>*/}

            </div>
            {children}
        </Form>
    );
}
